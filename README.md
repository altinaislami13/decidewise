DecideWise
Make big decisions with confidence — not guesswork.
DecideWise is a multi-criteria decision analysis (MCDA) web app that helps you compare options logically, visually, and objectively. Whether you're choosing a job offer, a city to live in, a university, or a laptop — DecideWise turns overwhelming choices into clear, data-driven decisions.

What it does
Most important decisions — job offers, where to live, what to buy — get made based on gut feeling, ignoring factors that actually matter. DecideWise fixes that by turning your priorities into a weighted scoring system. You define what matters and how much, rate each option, and the algorithm surfaces the winner transparently.
The result isn't just a number. You get bar charts, radar charts, a full score breakdown, a confidence indicator, and a saved history of every decision you've ever made.

How it works
DecideWise uses the Weighted Sum Model (WSM) — a classic multi-criteria decision analysis algorithm:
Score(option) = Σ (weight_i / totalWeight × score_i)
Example
CriterionWeightJob AJob BSalary40%86Location20%79Work-Life Balance15%68Growth25%97Total7.757.15
→ DecideWise recommends Job A.

Features

Multi-criteria decision system — define any number of criteria tailored to your specific decision
Custom weight assignment — set percentage weights per criterion; must total exactly 100%
Auto-normalize — one click redistributes weights proportionally if they don't sum to 100%
Weighted scoring matrix — rate each option 1–10 per criterion with color-coded sliders
Confidence indicator — automatically calculates whether the result is a clear win or a close call
Visual comparison — bar chart, radar chart, and detailed score breakdown table
5 quick-start templates — Job Offer, City to Live In, University, Laptop/Tech, Custom
Decision history — all decisions saved to localStorage; revisit and reload any past decision
Fully offline — no backend, no account, no server required


The 4-step flow
Home → Setup → Criteria → Scoring → Results
Step 1 — Setup: Name your decision and add at least 2 options to compare.
Step 2 — Criteria: Add criteria and assign weights. The app validates that weights sum to exactly 100%.
Step 3 — Scoring: Rate every option 1–10 across all criteria using an interactive matrix. A progress bar tracks completion.
Step 4 — Results: See the winner, confidence level, ranking, and three different chart views. Save the decision to history.
Each step only unlocks when the previous one is complete, ensuring data integrity throughout.

Tech stack
LayerTechnologyUIReact 18ChartsRecharts 2.8StateReact Hooks (custom)BuildVite 5StoragelocalStorageStylingCSS-in-JS (inline)
No Redux, no external state library, no backend. The scoring logic is fully decoupled from the UI — swapping localStorage for a REST API only requires changing decisionStore.js.

Project structure
decidewise/
├── index.html                    # Entry point, CSS variables, Google Fonts
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # Global state + step routing
    ├── types/
    │   └── index.js              # Templates, score labels, color palette
    ├── utils/
    │   └── scoringAlgorithm.js   # WSM algorithm, ranking, confidence, chart data
    ├── store/
    │   └── decisionStore.js      # useDecision + useDecisionStore hooks
    └── components/
        ├── Home.jsx              # Landing page
        ├── Stepper.jsx           # Progress indicator bar
        ├── Setup.jsx             # Step 1: title + options
        ├── CriteriaBuilder.jsx   # Step 2: criteria + weight sliders
        ├── ScoreMatrix.jsx       # Step 3: scoring table
        ├── Results.jsx           # Step 4: charts + winner + save
        └── HistoryPanel.jsx      # Slide-in history drawer

Getting started
Prerequisites

Node.js >= 18
npm or yarn

Installation
bashgit clone https://github.com/yourusername/decidewise.git
cd decidewise
npm install
npm run dev
Open http://localhost:5173 in your browser.
Build for production
bashnpm run build
npm run preview

The core algorithm
The entire decision engine lives in src/utils/scoringAlgorithm.js. It's intentionally kept pure (no React, no side effects) so it can be tested or reused independently.
jsfunction calcScores(options, criteria, scores) {
  const totalW = criteria.reduce((s, c) => s + c.weight, 0);

  return options.map(opt => {
    let total = 0;
    criteria.forEach(c => {
      const raw = scores[opt.id]?.[c.id] ?? 0;
      const normalizedWeight = c.weight / totalW;
      total += normalizedWeight * raw;
    });
    return { optionName: opt.name, total: +total.toFixed(2) };
  });
}
Key supporting functions:

rank(scored) — sorts options highest to lowest score
confidence(margin) — returns High / Moderate / Very Close Call based on the gap between #1 and #2
validateW(criteria) — checks weights sum to exactly 100%
generateRadarData() / generateBarData() — formats data for Recharts


Confidence levels
Margin between #1 and #2Level≥ 2.0High Confidence1.0 – 1.99Moderate< 1.0Very Close Call
A "Very Close Call" is a signal to reconsider your weights, not necessarily to pick differently.

Roadmap

 AI-assisted criteria suggestions (Anthropic API)
 Export to PDF report
 Backend REST API (Node.js + PostgreSQL) for cross-device sync
 Collaborative decisions — multiple users weight independently, results averaged
 React Native mobile app
 Dark mode


Contributing
Pull requests are welcome. For significant changes, open an issue first to discuss what you'd like to change.
bashgit checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
# Open a Pull Request
