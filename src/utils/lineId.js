/**
 * Assigns Line IDs to suggestions based on brand PO grouping logic.
 * Returns an object: { [suggestionId]: lineId }
 */
export function assignLineIDs(suggestions, brand) {
  const activeSuggestions = suggestions.filter(
    (s) => s.status === 'approved' || s.status === 'edited'
  );

  const groupMap = {}; // groupKey → lineId
  const assignment = {}; // suggestionId → lineId
  let nextLineId = 1;

  activeSuggestions.forEach((s) => {
    let groupKey;
    switch (brand.poLogic) {
      case 'style':
        groupKey = s.styleCode;
        break;
      case 'colour':
        groupKey = `${s.styleCode}__${s.colour}`;
        break;
      case 'sku':
        // Each size within a style/colour is its own SKU
        // For grouping purposes, each style/colour combo maps to a "group"
        // but each individual size row becomes its own line
        groupKey = `${s.styleCode}__${s.colour}`;
        break;
      case 'style-colour':
        groupKey = `${s.styleCode}__${s.colour}`;
        break;
      default:
        groupKey = s.styleCode;
    }

    if (!(groupKey in groupMap)) {
      groupMap[groupKey] = nextLineId++;
    }
    assignment[s.id] = groupMap[groupKey];
  });

  return assignment;
}

/**
 * Builds a display-friendly grouping tree for the LineID panel.
 * Returns an array of groups: { lineId, suggestions[] }
 */
export function buildGroupTree(suggestions, lineIdAssignment) {
  const groups = {};

  suggestions.forEach((s) => {
    const lineId = lineIdAssignment[s.id];
    if (lineId == null) return;
    if (!groups[lineId]) groups[lineId] = [];
    groups[lineId].push(s);
  });

  return Object.entries(groups)
    .map(([lineId, suggs]) => ({
      lineId: Number(lineId),
      suggestions: suggs,
    }))
    .sort((a, b) => a.lineId - b.lineId);
}

/**
 * Merges the Line ID of sourceSuggestionId into the Line ID of targetSuggestionId.
 */
export function mergeSuggestionIntoGroup(lineIdAssignment, sourceSuggestionId, targetLineId) {
  return { ...lineIdAssignment, [sourceSuggestionId]: targetLineId };
}

/**
 * Splits a suggestion out to its own new Line ID.
 */
export function splitSuggestionToNewGroup(lineIdAssignment) {
  const maxLineId = Math.max(0, ...Object.values(lineIdAssignment));
  return { ...lineIdAssignment }; // caller should set [suggestionId] = maxLineId + 1
}
