// Weighted Sum Model (WSM) implementation

export function calculateScores(options, criteria, scores) {
  if (!options.length || !criteria.length) return [];

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return options.map(option => {
    let total = 0;
    const breakdown = {};

    criteria.forEach(criterion => {
      const score = scores[option.id]?.[criterion.id] ?? 0;
      const normalizedWeight = criterion.weight / totalWeight;
      const weighted = normalizedWeight * score;
      total += weighted;
      breakdown[criterion.id] = {
        raw: score,
        weight: criterion.weight,
        normalizedWeight,
        weighted: +weighted.toFixed(3),
      };
    });

    return {
      optionId: option.id,
      optionName: option.name,
      total: +total.toFixed(2),
      breakdown,
    };
  });
}

export function rankOptions(scored) {
  return [...scored].sort((a, b) => b.total - a.total);
}

export function getWinner(ranked) {
  return ranked[0] || null;
}

export function getMargin(ranked) {
  if (ranked.length < 2) return 0;
  return +(ranked[0].total - ranked[1].total).toFixed(2);
}

export function getConfidenceLevel(margin) {
  if (margin >= 2) return { label: 'High Confidence', color: '#4a6741', icon: '✓' };
  if (margin >= 1) return { label: 'Moderate Confidence', color: '#c8973a', icon: '~' };
  return { label: 'Very Close Call', color: '#b84c2b', icon: '!' };
}

export function validateWeights(criteria) {
  const total = criteria.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  return { total, isValid: Math.abs(total - 100) < 0.01 };
}

export function normalizeWeights(criteria) {
  const total = criteria.reduce((sum, c) => sum + c.weight, 0);
  if (total === 0) return criteria;
  return criteria.map(c => ({ ...c, weight: Math.round((c.weight / total) * 100) }));
}

export function generateRadarData(options, criteria, scores) {
  return criteria.map(criterion => {
    const entry = { criterion: criterion.name };
    options.forEach(option => {
      entry[option.name] = scores[option.id]?.[criterion.id] ?? 0;
    });
    return entry;
  });
}

export function generateBarData(ranked) {
  return ranked.map(r => ({
    name: r.optionName,
    score: r.total,
    percentage: +((r.total / 10) * 100).toFixed(1),
  }));
}
