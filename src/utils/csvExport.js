/**
 * Generates and triggers a CSV download for the rebuy sheet.
 * Supports standard and PLT formats.
 */
export function exportCSV(suggestions, lineIdAssignment, brand) {
  const activeSuggestions = suggestions.filter(
    (s) => s.status === 'approved' || s.status === 'edited'
  );

  let rows = [];
  let headers = [];

  if (brand.poLogic === 'sku') {
    // PLT format: one row per SKU (style + colour + size)
    headers = [
      'Line ID',
      'SKU',
      'Supplier Code',
      'Factory Code',
      'Shipping Method',
      'Port of Loading',
      'Supplier Reference',
      'X Factory Date',
      'Cost Price',
      'Quantity',
    ];

    activeSuggestions.forEach((s) => {
      const lineId = lineIdAssignment[s.id] ?? '';
      Object.entries(s.sizes).forEach(([size, qty]) => {
        if (qty > 0) {
          const sku = `${s.styleCode}-${s.colour.replace(/\//g, '-').replace(/\s/g, '-').toUpperCase()}-${size}`;
          rows.push([
            lineId,
            sku,
            s.supplierCode,
            s.factoryCode,
            s.shippingMethod,
            s.portOfLoading,
            s.supplierReference,
            s.xFactoryDate,
            s.costPrice.toFixed(2),
            qty,
          ]);
        }
      });
    });
  } else {
    // Standard format: one row per style + colour + size
    headers = [
      'Line ID',
      'Style Code',
      'Colour',
      'Size',
      'Supplier Code',
      'Factory Code',
      'Shipping Method',
      'Port of Loading',
      'Supplier Reference',
      'X Factory Date',
      'Cost Price',
      'Quantity',
    ];

    activeSuggestions.forEach((s) => {
      const lineId = lineIdAssignment[s.id] ?? '';
      Object.entries(s.sizes).forEach(([size, qty]) => {
        if (qty > 0) {
          rows.push([
            lineId,
            s.styleCode,
            s.colour,
            size,
            s.supplierCode,
            s.factoryCode,
            s.shippingMethod,
            s.portOfLoading,
            s.supplierReference,
            s.xFactoryDate,
            s.costPrice.toFixed(2),
            qty,
          ]);
        }
      });
    });
  }

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          // Escape cells containing commas, quotes, or newlines
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date('2026-03-10').toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  link.href = url;
  link.download = `${brand.name.replace(/\s+/g, '-')}-Rebuy-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
