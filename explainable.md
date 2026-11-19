# 🌿 Explainable AI in Fernhollow: How & Why AI is Used

This document explains all the **Artificial Intelligence (AI)** concepts, models, and techniques used in the **Fernhollow Product Eco-Analysis** project, written in simple, clear language.

---

## 1. What Does AI Do in This Project?

When someone pastes an Amazon product link (like bamboo plates, herbal shampoo, or notebooks), the product page contains hundreds of words of marketing text, technical specs, and ingredient jargon.

A human would need 20 minutes to read the fine print and search ecological databases. **Fernhollow uses AI to read, understand, and audit that product in 3 seconds.**

---

## 2. Core AI Topics Used in the Project

### 🧠 1. Large Language Model (Google Gemini API)
* **What it is:** Google's state-of-the-art Generative AI model (`gemini-3.8-flash` / `gemini-3.5-flash`).
* **Why we use it:** Traditional software only searches for exact keywords. Gemini understands **context, nuance, and meaning**. For example, it knows that *"chemical-free"* is scientifically impossible (all matter is chemical), and that *"bamboo"* is eco-friendly unless bonded with toxic melamine plastic resin.
* **How it works:** 
  1. The server extracts the product title, bullet points, and description from Amazon.
  2. It sends this raw text to Gemini with specialized instructions (prompt engineering).
  3. Gemini reads the entire product profile and performs an ecological audit.

---

### 📦 2. Structured JSON Output & Schema Enforcement
* **What it is:** Forcing the AI to reply in strict code format (JSON) instead of conversational chat paragraphs.
* **Why we use it:** The interactive user interface needs exact numbers, percentages, and lists to draw the animated dials, comparison tree, and interactive drawers.
* **How it works:**
  - We configure Gemini with `responseMimeType: "application/json"`.
  - The model outputs clean data fields:
    - `eco_score` (0 to 100)
    - `positive_factors` (headline, ingredient, cause & effect)
    - `negative_factors` (headline, ingredient, cause & effect)
    - `greenwash_warning` (detected deceptive claims)
    - `greener_tip` (actionable advice for cleaner alternatives)

---

### 🔬 3. Life Cycle Assessment (LCA) Modeling via AI
* **What it is:** Estimating the environmental impact of a product from "cradle to grave" (birth to disposal).
* **Why we use it:** Real industrial LCA audits cost thousands of dollars and take months. AI provides an instant, scientific approximation for everyday shoppers.
* **How it works:** The AI breaks the product down across 4 lifecycle stages:
  1. **Raw Material Stage:** Renewable plant biomass vs. virgin fossil hydrocarbons.
  2. **Manufacturing & Chemistry:** Energy intensity, harmful solvents, or toxic glues.
  3. **Packaging & Transit:** Curbside recyclable corrugated boxes vs. single-use plastic heat-shrink wrap.
  4. **End-of-Life:** True home compostability and repulpability vs. persistent landfill microplastics.

---

### 🛡️ 4. Greenwashing Detection (Semantic Truth Auditing)
* **What it is:** Identifying deceptive or misleading environmental claims made by brands.
* **Why we use it:** Many brands slap words like *"eco-friendly"*, *"100% natural"*, or *"earth-conscious"* on products without holding any real certifications.
* **How it works:**
  - The AI cross-references the product claims with international standards (such as the **FTC Green Guides** and **EU Green Claims Directive**).
  - If a product claims to be *"Organic"* but displays no USDA Organic or ECOCERT registration, the AI flags it under **Greenwashing Alert**.

---

### ⚖️ 5. Transparent Hybrid Scoring (Explainable AI / XAI)
* **What it is:** Combining AI reasoning with deterministic rule-based checks, and explaining *why* a score was given.
* **Why we use it:** Users don't trust a "black box" that just spits out a number like "47/100" without justification.
* **How it works:**
  - **Score Formula:** 60% comes from Gemini's deep contextual reasoning + 40% comes from deterministic material signal audits.
  - **Attribution:** Every single point in the **Comparison Tree** clearly lists the exact ingredient responsible, the lifecycle stage, and the cause-and-effect mechanism.

---

### 🔄 6. Fault-Tolerant Fallback Architecture (High Availability)
* **What it is:** A safety net that ensures the app never crashes or shows a blank screen if the AI API is busy or offline.
* **Why we use it:** Cloud AI services can occasionally experience high demand (HTTP 503 errors) or network latency.
* **How it works:**
  - If Gemini answers successfully, the app uses full AI analysis.
  - If the API times out or hits rate limits, an automated **Rule-Based Heuristic Engine** (`eco_analyzer.py`) instantly steps in, scans the ingredients using pre-compiled ecological signal dictionaries, and returns a verified result immediately.

---

## 3. Summary Flow Diagram

```
[ Amazon Product Link ]
          │
          ▼
[ Scraper / Text Extraction ]
          │
          ▼
[ Google Gemini AI (3.8 Flash) ]  ──(If API Busy)──►  [ Rule-Based Fallback Engine ]
          │                                                    │
          ▼                                                    ▼
[ Structured JSON: LCA Metrics, Greenwashing Flags, Ingredient Lifecycle Reasons ]
          │
          ▼
[ Fernhollow Interactive 3D UI: Score Dial, Comparison Tree, 4 Pillars, Guidance ]
```

---

## 4. Key Takeaways
- **AI is used for understanding, not just guessing:** It reads real ingredient text and uncovers hidden tradeoffs (like plastic shrink-wrap or unverified claims).
- **Everything is explainable:** Every score is backed by real ingredient citations and life-cycle mechanisms.
- **Fast, reliable, and user-centric:** Delivers expert-grade sustainability auditing to everyday consumers in seconds.
