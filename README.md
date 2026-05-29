🎯 DecideWise

Make big decisions with confidence — not guesswork.

DecideWise is a multi-criteria decision analysis (MCDA) web application that helps you compare options logically, visually, and objectively. Whether you're choosing a job offer, a university, a laptop, or a city to live in — DecideWise turns overwhelming choices into clear, data-driven decisions.

✨ Features

🧩 Multi-Criteria Decision System — Define any number of criteria tailored to your decision
⚖️ Custom Weight Assignment — Assign percentage weights to each criterion based on your priorities
🧮 Weighted Scoring Algorithm — Each option is scored using a transparent weighted average formula
📊 Visual Comparison Charts — Bar charts, radar charts, and score breakdowns for instant insight
💾 Saved Decisions — Store and revisit past decisions (localStorage)
📚 Decision History — Track how your thinking evolves over time
📱 Responsive UI — Works seamlessly on desktop and mobile
🎯 Confidence Indicator — Know instantly if it's a clear win or a close call

🧠 How It Works

DecideWise uses the Weighted Sum Model (WSM) — a classic multi-criteria decision analysis algorithm:

Score(option) = Σ (weight_i × score_i)

Example — Choosing Between Two Jobs

Criteria         Weight   Job A   Job B
Salary             40%      8       6
Location           20%      7       9
Work-Life Balance  15%      6       8
Growth             25%      9       7

Job A Total: (0.40×8) + (0.20×7) + (0.15×6) + (0.25×9) = 7.75 ✅
Job B Total: (0.40×6) + (0.20×9) + (0.15×8) + (0.25×7) = 7.15

DecideWise recommends Job A 🎉

🗺️ The 4-Step Flow

① Setup → ② Criteria → ③ Scoring → ④ Results

① Setup     — Name your decision and add at least 2 options to compare
② Criteria  — Add criteria and assign % weights (must total exactly 100%)
③ Scoring   — Rate each option 1–10 per criterion using interactive sliders
④ Results   — See the winner, confidence level, charts, and save to history

🛠️ Tech Stack

Layer        Technology
Frontend     React 18
Charts       Recharts 2.8
State        React Hooks (custom)
Build        Vite 5
Storage      localStorage
Styling      CSS-in-JS

🚀 Getting Started

Prerequisites

Node.js >= 18
npm or yarn
Installation

git clone https://github.com/yourusername/decidewise.git cd decidewise npm install npm run dev

Build for Production

npm run build
npm run preview

📁 Project Structure

decidewise/
├── index.html
├── vite.config.js
├── package.json
└── src/
├── main.jsx
├── App.jsx                   — Global state + step routing
├── types/
│   └── index.js              — Templates, labels, color palette
├── utils/
│   └── scoringAlgorithm.js   — WSM engine — the core of everything
├── store/
│   └── decisionStore.js      — useDecision + useDecisionStore hooks
└── components/
├── Home.jsx              — Landing page
├── Stepper.jsx           — Progress indicator
├── Setup.jsx             — Step 1: title + options
├── CriteriaBuilder.jsx   — Step 2: criteria + weight sliders
├── ScoreMatrix.jsx       — Step 3: scoring table
├── Results.jsx           — Step 4: charts + winner + save
└── HistoryPanel.jsx      — Slide-in history drawer

📊 Portfolio Value

✅ Algorithm Design     — Weighted scoring & MCDA implementation
✅ Data Modeling        — Flexible schema for options, criteria, and weights
✅ Analytics Dashboard  — Interactive charts and visual comparisons
✅ State Management     — Complex, nested application state via custom hooks
✅ UX Thinking          — Guiding users through a structured decision process
✅ Persistence Layer    — Saving and loading decisions across sessions

🗺️ Roadmap

☐ 🤖 AI-assisted criteria suggestions
☐ 👥 Team / collaborative decisions
☐ 📄 Export to PDF report
☐ 📱 Mobile app (React Native)
☐ 🌙 Dark / Light mode
☐ 🔄 Decision comparison history

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

Fork the repo
Create your branch → git checkout -b feature/amazing-feature
Commit your changes → git commit -m 'Add amazing feature'
Push to the branch → git push origin feature/amazing-feature
Open a Pull Request
📄 License

MIT License — see LICENSE for details.

Built with ❤️ to eliminate decision fatigue.






