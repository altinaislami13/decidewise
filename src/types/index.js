// Types for DecideWise

export const DECISION_TEMPLATES = [
  {
    id: 'job',
    name: 'Job Offer',
    icon: '💼',
    criteria: [
      { name: 'Salary', weight: 35 },
      { name: 'Career Growth', weight: 25 },
      { name: 'Work-Life Balance', weight: 20 },
      { name: 'Location', weight: 10 },
      { name: 'Company Culture', weight: 10 },
    ]
  },
  {
    id: 'city',
    name: 'City to Live In',
    icon: '🏙️',
    criteria: [
      { name: 'Cost of Living', weight: 30 },
      { name: 'Job Market', weight: 25 },
      { name: 'Quality of Life', weight: 20 },
      { name: 'Climate', weight: 15 },
      { name: 'Community', weight: 10 },
    ]
  },
  {
    id: 'university',
    name: 'University',
    icon: '🎓',
    criteria: [
      { name: 'Academic Reputation', weight: 35 },
      { name: 'Tuition Cost', weight: 25 },
      { name: 'Location', weight: 15 },
      { name: 'Campus Life', weight: 15 },
      { name: 'Career Services', weight: 10 },
    ]
  },
  {
    id: 'laptop',
    name: 'Laptop / Tech',
    icon: '💻',
    criteria: [
      { name: 'Performance', weight: 30 },
      { name: 'Price', weight: 25 },
      { name: 'Battery Life', weight: 20 },
      { name: 'Build Quality', weight: 15 },
      { name: 'Portability', weight: 10 },
    ]
  },
  {
    id: 'custom',
    name: 'Custom Decision',
    icon: '✨',
    criteria: []
  }
];

export const SCORE_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Below Average',
  4: 'Slightly Below',
  5: 'Average',
  6: 'Slightly Above',
  7: 'Good',
  8: 'Very Good',
  9: 'Excellent',
  10: 'Perfect',
};

export const COLORS = ['#c8973a', '#b84c2b', '#4a6741', '#5b7ea6', '#8b5cf6', '#ec4899'];
