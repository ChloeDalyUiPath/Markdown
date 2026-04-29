// Markdown rule definitions (used for guardrail set configuration)
export const MARKDOWN_RULES = [
  { id: 'no-forced',      label: "Don't Force Any Line to Have Markdown",                                short: 'No forced lines', showPct: false, showDepth: false, description: 'No mandatory markdowns — lets the system land at the optimal point.' },
  { id: 'book-price',     label: 'Only Force if Still at Book Price',                                    short: 'Book price only', showPct: false, showDepth: false, description: 'Targets only items still at original price.' },
  { id: 'eligible-only',  label: 'Only Force Eligible Products',                                         short: 'Eligible only',   showPct: false, showDepth: false, description: 'Markdown applies only where eligibility rules are met.' },
  { id: 'pct-markdown',   label: 'Force a Percentage to Have Markdowns',                                 short: '% coverage',      showPct: true,  showDepth: false, description: 'More products in sale — moves toward clearance territory.' },
  { id: 'all-markdown',   label: 'Force All to Have Markdown',                                           short: 'Force all',       showPct: false, showDepth: false, description: 'Every product receives a markdown — maximises clearance velocity.' },
  { id: 'depth-coverage', label: 'Force X% of Products at Y% Off',                                      short: 'X% at Y% off',    showPct: true,  showDepth: true,  description: 'Deeper discounts — targets a percentage of products at a set depth.' },
  { id: 'layered',        label: 'Force a Percentage to Have Markdowns, With X% of Products at Y% Off', short: 'Layered',         showPct: true,  showDepth: true,  description: 'More products AND deeper discounts.' },
]

export const RL_CATEGORIES = [
  { id: 1, name: "Women's Polo",  weight: 0.25 },
  { id: 2, name: 'Knitwear',      weight: 0.20 },
  { id: 3, name: 'Oxford Shirts', weight: 0.15 },
  { id: 4, name: 'Chinos',        weight: 0.15 },
  { id: 5, name: 'Outerwear',     weight: 0.15 },
  { id: 6, name: 'Accessories',   weight: 0.10 },
]

// Two guardrail sets selected at campaign creation — each represents a separate optimisation run.
export const DEFAULT_GUARDRAIL_SETS = [
  {
    id: 1,
    label: 'Set A',
    name: 'Standard',
    colorClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    accentColor: '#2a44d4',
    rule: { ruleId: 'eligible-only', pctMarkdown: 0, depthPct: 0 },
  },
  {
    id: 2,
    label: 'Set B',
    name: 'Aggressive',
    colorClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    accentColor: '#d97706',
    rule: { ruleId: 'depth-coverage', pctMarkdown: 40, depthPct: 30 },
  },
]

// Post-optimisation curve outputs — one curve per guardrail set
export const SET_A_CURVE = [
  { id: 'a1', pct: 5,  x: 82, y: 70 },
  { id: 'a2', pct: 10, x: 72, y: 74 },
  { id: 'a3', pct: 15, x: 61, y: 78 },
  { id: 'a4', pct: 20, x: 50, y: 83, recommended: true },
  { id: 'a5', pct: 25, x: 39, y: 86 },
  { id: 'a6', pct: 30, x: 29, y: 88 },
]

export const SET_B_CURVE = [
  { id: 'b1', pct: 15, x: 58, y: 72 },
  { id: 'b2', pct: 20, x: 47, y: 77 },
  { id: 'b3', pct: 25, x: 36, y: 83 },
  { id: 'b4', pct: 30, x: 25, y: 88, recommended: true },
  { id: 'b5', pct: 35, x: 16, y: 91 },
  { id: 'b6', pct: 40, x: 9,  y: 93 },
]

// Default: each category on Set A at the recommended point (20% markdown)
export const DEFAULT_CATEGORY_SELECTIONS = Object.fromEntries(
  RL_CATEGORIES.map(c => [c.id, { guardrailSetId: 1, pointId: 'a4' }])
)
