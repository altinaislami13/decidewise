import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Stepper from './components/Stepper.jsx';
import Home from './components/Home.jsx';
import Setup from './components/Setup.jsx';
import CriteriaBuilder from './components/CriteriaBuilder.jsx';
import ScoreMatrix from './components/ScoreMatrix.jsx';
import Results from './components/Results.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import { useDecision, useDecisionStore } from './store/decisionStore.js';


export default function App() {
  const [view, setView] = useState('home'); // home | decision
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const decision = useDecision();
  const store = useDecisionStore();

  function handleStart(template) {
    decision.reset();
    if (template) {
      decision.loadTemplate(template);
      setSelectedTemplate(template.id);
    } else {
      setSelectedTemplate(null);
    }
    setView('decision');
    decision.setStep('setup');
  }

  function handleLoadTemplate(template) {
    handleStart(template);
  }

  function handleLoadSaved(saved) {
    decision.loadSaved(saved);
    setView('decision');
  }

  function handleNew() {
    decision.reset();
    setSelectedTemplate(null);
    setView('home');
  }

  return (
    <div>
      <Header
        step={decision.step}
        setStep={decision.setStep}
        onNew={handleNew}
        onHistory={() => setShowHistory(true)}
      />

      {view === 'home' ? (
        <Home onStart={handleStart} onLoadTemplate={handleLoadTemplate} />
      ) : (
        <>
          <Stepper currentStep={decision.step} />

          {decision.step === 'setup' && (
            <Setup
              title={decision.title}
              setTitle={decision.setTitle}
              description={decision.description}
              setDescription={decision.setDescription}
              options={decision.options}
              addOption={decision.addOption}
              removeOption={decision.removeOption}
              updateOption={decision.updateOption}
              loadTemplate={decision.loadTemplate}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              onNext={() => {
                if (decision.criteria.length === 0) decision.addCriterion('', 0);
                decision.setStep('criteria');
              }}
            />
          )}

          {decision.step === 'criteria' && (
            <CriteriaBuilder
              criteria={decision.criteria}
              addCriterion={decision.addCriterion}
              removeCriterion={decision.removeCriterion}
              updateCriterion={decision.updateCriterion}
              onNext={() => decision.setStep('scoring')}
              onBack={() => decision.setStep('setup')}
            />
          )}

          {decision.step === 'scoring' && (
            <ScoreMatrix
              options={decision.options}
              criteria={decision.criteria}
              scores={decision.scores}
              setScore={decision.setScore}
              onNext={() => decision.setStep('results')}
              onBack={() => decision.setStep('criteria')}
            />
          )}

          {decision.step === 'results' && (
            <Results
              title={decision.title}
              options={decision.options}
              criteria={decision.criteria}
              scores={decision.scores}
              saveDecision={store.saveDecision}
              onNew={handleNew}
              onEdit={() => decision.setStep('scoring')}
            />
          )}
        </>
      )}

      {showHistory && (
        <HistoryPanel
          decisions={store.savedDecisions}
          onLoad={handleLoadSaved}
          onDelete={store.deleteDecision}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
