import { FACTORIES, SUPPLIERS } from '../data/mockData.js';

const TODAY = new Date('2026-03-10');

export function runValidation(suggestions, brand) {
  const results = [];
  const approvedOrEdited = suggestions.filter(
    (s) => s.status === 'approved' || s.status === 'edited'
  );

  if (approvedOrEdited.length === 0) {
    results.push({
      id: 'no-approvals',
      severity: 'error',
      category: 'Submissions',
      message: 'No suggestions approved',
      detail: 'At least one suggestion must be approved or edited before exporting.',
    });
    return results;
  }

  approvedOrEdited.forEach((s) => {
    const factory = FACTORIES.find((f) => f.code === s.factoryCode);
    const supplier = SUPPLIERS.find((sup) => sup.code === s.supplierCode);

    // ❌ Inactive factory — block
    if (factory && !factory.active) {
      results.push({
        id: `inactive-factory-${s.id}`,
        severity: 'error',
        category: 'Factory',
        message: `Inactive factory: ${factory.name}`,
        detail: `${s.styleCode} (${s.colour}) is assigned to an inactive factory. Reassign before export.`,
        suggestionId: s.id,
      });
    }

    // ❌ Inactive supplier — block
    if (supplier && !supplier.active) {
      results.push({
        id: `inactive-supplier-${s.id}`,
        severity: 'error',
        category: 'Supplier',
        message: `Inactive supplier: ${supplier.name}`,
        detail: `${s.styleCode} (${s.colour}) uses an inactive supplier. Reassign before export.`,
        suggestionId: s.id,
      });
    }

    // ❌ X Factory date in the past — block
    if (s.xFactoryDate) {
      const xFac = new Date(s.xFactoryDate);
      if (xFac < TODAY) {
        results.push({
          id: `past-date-${s.id}`,
          severity: 'error',
          category: 'Dates',
          message: `X Factory date in the past: ${s.styleCode}`,
          detail: `${s.styleCode} (${s.colour}) has an X Factory date of ${s.xFactoryDate}, which is in the past. Update before export.`,
          suggestionId: s.id,
        });
      }
    }

    // ❌ Quantity > 5000 per size — block
    const oversizedEntries = Object.entries(s.sizes).filter(([, qty]) => qty > 5000);
    if (oversizedEntries.length > 0) {
      results.push({
        id: `qty-exceeded-${s.id}`,
        severity: 'error',
        category: 'Quantities',
        message: `Quantity exceeds 5,000 per size: ${s.styleCode}`,
        detail: `${s.styleCode} has sizes exceeding the 5,000 unit maximum: ${oversizedEntries.map(([sz, qty]) => `${sz}: ${qty}`).join(', ')}.`,
        suggestionId: s.id,
      });
    }

    // ⚠️ Cost price unchanged from last rebuy
    if (s.costPrice === s.lastCostPrice && s.lastCostPrice != null) {
      results.push({
        id: `unchanged-cost-${s.id}`,
        severity: 'warning',
        category: 'Cost Prices',
        message: `Cost unchanged from last rebuy: ${s.styleCode}`,
        detail: `${s.styleCode} (${s.colour}) cost is £${s.costPrice.toFixed(2)}, same as last rebuy. Consider renegotiating before committing.`,
        suggestionId: s.id,
      });
    }

    // ⚠️ Transit days missing for factory/shipping method
    if (factory) {
      const transit = factory.transitDays[s.shippingMethod];
      if (transit == null) {
        results.push({
          id: `no-transit-${s.id}`,
          severity: 'warning',
          category: 'Delivery',
          message: `Transit days unavailable: ${s.styleCode} via ${s.shippingMethod}`,
          detail: `No transit time data for ${factory.name} using ${s.shippingMethod} shipping. Delivery date cannot be calculated.`,
          suggestionId: s.id,
        });
      }
    }

    // ⚠️ Supplier reference missing
    if (!s.supplierReference || s.supplierReference.trim() === '') {
      results.push({
        id: `no-ref-${s.id}`,
        severity: 'warning',
        category: 'References',
        message: `Supplier reference missing: ${s.styleCode}`,
        detail: `${s.styleCode} (${s.colour}) has no supplier reference. This may cause matching issues in Order App.`,
        suggestionId: s.id,
      });
    }
  });

  // ℹ️ Brand approval workflow reminder
  results.push({
    id: 'brand-approval',
    severity: 'info',
    category: 'Approval',
    message: `${brand.name} approval workflow`,
    detail: brand.approvalNote,
  });

  return results;
}

export function getValidationSummary(results) {
  const errors = results.filter((r) => r.severity === 'error');
  const warnings = results.filter((r) => r.severity === 'warning');
  const canExport = errors.length === 0;

  if (errors.length > 0) {
    const errorCategories = [...new Set(errors.map((e) => e.category))].join(' and ');
    return {
      canExport,
      text: `This rebuy run has ${errors.length} blocking issue${errors.length > 1 ? 's' : ''} that must be resolved before export, related to ${errorCategories}. ${warnings.length > 0 ? `There are also ${warnings.length} warning${warnings.length > 1 ? 's' : ''} to review.` : ''} Resolve all errors to proceed.`,
    };
  }

  if (warnings.length > 0) {
    return {
      canExport: true,
      text: `No blocking issues found — this rebuy run is ready to export. There ${warnings.length === 1 ? 'is' : 'are'} ${warnings.length} warning${warnings.length > 1 ? 's' : ''} to review before committing: check cost prices and any missing references. You can export now, but it's worth addressing these first.`,
    };
  }

  return {
    canExport: true,
    text: 'All checks passed. This rebuy run is clean and ready to export. No blocking issues or warnings detected.',
  };
}
