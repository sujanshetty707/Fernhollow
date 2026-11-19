# 🌸 Fernhollow — 3D Bioluminescent Product Eco-Analyzer

> An immersive 3D bioluminescent night valley web application that audits the environmental life cycle, chemical safety, and greenwashing risks of consumer products using Google Gemini AI.

---

## ✨ Features

- **Immersive 3D Valley Engine**: Real-time bioluminescent flora, interactive camera depth scroll, particle streams, and night garden ambient acoustics.
- **AI-Powered Life Cycle Assessment (LCA)**: Evaluates raw materials, chemistry & toxicology, packaging footprint, and end-of-life biodegradability in seconds.
- **Deceptive Greenwashing Detection**: Automatically cross-references brand marketing claims against international regulatory standards (FTC Green Guides & EU Green Claims Directive).
- **Interactive Eco Comparison Tree**: Timeline branching nodes with real-time scroll tracking, directional arrows, and individual factor disclosure.
- **Synchronized 4-Pillar Signals**: 1-click synchronized deep dive across Materials, Circularity, Packaging, and Certification Credentials.
- **Studio Greener Choice Guidance**: Strategic purchasing recommendations, alternative feedstocks, and pre-purchase verification checklists.
- **Fault-Tolerant Hybrid Architecture**: Gemini AI scoring (60%) paired with a local deterministic signal engine (40%) and graceful offline fallback.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/sujanshetty707/Fernhollow.git
cd Fernhollow
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
Create a `.env` file in the root directory (or copy `.env.example`):
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Run the application
```bash
python server.py
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🛠️ Tech Stack

- **Frontend**: Single-file WebGL/Three.js 3D Valley Engine, vanilla modern JavaScript, procedural SVG animations, KaTeX, Cormorant & DM Sans typography.
- **Backend**: Python 3, Flask, Flask-CORS, BeautifulSoup4, Requests.
- **AI / LLM**: Google Gemini API (`gemini-3.8-flash` / `gemini-3.5-flash`) with structured JSON schema output and automated heuristic fallback.

---

## 📖 Explainable AI Documentation

For detailed information on how and why AI is implemented in this project, read [explainable.md](explainable.md).

---

## 📄 License

MIT License — see LICENSE for details.
