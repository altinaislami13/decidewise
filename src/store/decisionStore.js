import { useState, useCallback } from 'react';

const STORAGE_KEY = 'decidewise_decisions';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Storage reset due to corruption");
    return [];
  }
}

function saveToStorage(decisions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {}
}

export function useDecisionStore() {
  const [savedDecisions, setSavedDecisions] = useState(loadFromStorage);

  const saveDecision = useCallback((decisionData) => {
    const decision = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...decisionData,
    };
    setSavedDecisions(prev => {
      const updated = [decision, ...prev];
      saveToStorage(updated);
      return updated;
    });
    return decision.id;
  }, []);

  const deleteDecision = useCallback((id) => {
    setSavedDecisions(prev => {
      const updated = prev.filter(d => d.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const loadDecision = useCallback((id) => {
    return savedDecisions.find(d => d.id === id) || null;
  }, [savedDecisions]);

  return { savedDecisions, saveDecision, deleteDecision, loadDecision };
}

export function useDecision() {
  const [step, setStep] = useState('setup'); // setup | criteria | scoring | results
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([
    { id: generateId(), name: 'Option A' },
    { id: generateId(), name: 'Option B' },
  ]);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});

  const addOption = useCallback(() => {
    setOptions(prev => [...prev, { id: generateId(), name: `Option ${String.fromCharCode(65 + prev.length)}` }]);
  }, []);

  const removeOption = useCallback((id) => {
    setOptions(prev => prev.filter(o => o.id !== id));
    setScores(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const updateOption = useCallback((id, name) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, name } : o));
  }, []);

  const addCriterion = useCallback((name = '', weight = 0) => {
    setCriteria(prev => [...prev, { id: generateId(), name, weight }]);
  }, []);

  const removeCriterion = useCallback((id) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
    setScores(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(optId => {
        if (next[optId]) {
          const optScores = { ...next[optId] };
          delete optScores[id];
          next[optId] = optScores;
        }
      });
      return next;
    });
  }, []);

  const updateCriterion = useCallback((id, field, value) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const setScore = useCallback((optionId, criterionId, value) => {
    setScores(prev => ({
      ...prev,
      [optionId]: {
        ...(prev[optionId] || {}),
        [criterionId]: value,
      }
    }));
  }, []);

  const loadTemplate = useCallback((template) => {
    setCriteria(template.criteria.map(c => ({ ...c, id: generateId() })));
  }, []);

  const reset = useCallback(() => {
    setStep('setup');
    setTitle('');
    setDescription('');
    setOptions([
      { id: generateId(), name: 'Option A' },
      { id: generateId(), name: 'Option B' },
    ]);
    setCriteria([]);
    setScores({});
  }, []);

  const loadSaved = useCallback((saved) => {
    setTitle(saved.title);
    setDescription(saved.description || '');
    setOptions(saved.options);
    setCriteria(saved.criteria);
    setScores(saved.scores);
    setStep('results');
  }, []);

  return {
    step, setStep,
    title, setTitle,
    description, setDescription,
    options, addOption, removeOption, updateOption,
    criteria, addCriterion, removeCriterion, updateCriterion,
    scores, setScore,
    loadTemplate, reset, loadSaved,
    getSnapshot: () => ({ title, description, options, criteria, scores }),
  };
}
