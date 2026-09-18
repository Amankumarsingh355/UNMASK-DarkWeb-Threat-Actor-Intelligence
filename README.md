# UNMASK-DarkWeb-Threat-Actor-Intelligence
AI-powered Dark Web Threat Intelligence platform for identifying, analyzing and mapping threat actors using entity resolution, graph analysis and risk scoring.
UNMASK is an AI-powered Dark Web Threat Intelligence platform designed to help security analysts discover, connect, and understand threat actors across fragmented sources.

Instead of looking at isolated usernames, wallets, posts, or indicators, UNMASK brings these signals together and represents their relationships through an interactive intelligence graph.


# The Problem

Threat actors on the Dark Web rarely operate under a single identity.

They may use:
* Different aliases and usernames
* Multiple cryptocurrency wallets
* Different platforms and forums
* Reused communication patterns
* Connected infrastructure and indicators

Manually connecting these scattered pieces of information is time-consuming and can make it difficult for analysts to identify meaningful relationships.

**UNMASK aims to simplify this process by connecting fragmented intelligence into one unified view.**

## Our Solution

UNMASK combines **AI-based entity extraction, entity resolution, graph analysis, anomaly detection, and risk scoring** to help analysts investigate potential threat actors.

The platform transforms raw intelligence into:

**Data → Entities → Relationships → Threat Graph → Risk Analysis → Actionable Intelligence**

---

## 🚀 Key Features

### 🔍 Threat Actor Identification

Identify potential threat actors from collected Dark Web intelligence and extracted indicators.

### 🧩 Entity Resolution

Connect aliases, usernames, wallets, organizations, and other indicators that may belong to the same entity.

### 🕸️ Interactive Threat Graph

Visualize relationships between threat actors, aliases, wallets, groups, and indicators through an interactive graph.

### 📊 Risk Scoring

Generate risk scores based on observed indicators and relationships to help prioritize investigations.

### 🚨 Threat Alerts

Highlight potentially critical relationships and suspicious activity for further investigation.

### 👤 Threat Actor Profiles

Explore an individual actor's aliases, connected entities, wallets, indicators, and associated activity.

### 📈 Intelligence Dashboard

Provide analysts with a centralized view of threat intelligence and investigation insights.

### 📁 Dataset Import

Support importing structured datasets for analysis and graph generation.

---

## 🧠 How UNMASK Works

```text
                 Dark Web / Threat Data
                          │
                          ▼
                  Data Collection
                          │
                          ▼
                 NLP & Entity Extraction
                          │
                          ▼
                  Entity Resolution
                          │
                          ▼
                   Relationship Mapping
                          │
                          ▼
                    Threat Graph
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        Risk Scoring             Anomaly Detection
              │                       │
              └───────────┬───────────┘
                          ▼
                  Analyst Dashboard
                          │
                          ▼
                Actionable Intelligence
```

---

## 🏗️ Architecture

UNMASK follows a modular architecture where different components work together to transform raw intelligence into meaningful threat insights.

### Core Pipeline

1. **Data Input**

   * Threat intelligence datasets
   * Indicators
   * Actor information
   * Related entities

2. **Entity Extraction**

   * Extract usernames
   * Aliases
   * Wallet addresses
   * Organizations
   * Other relevant indicators

3. **Entity Resolution**

   * Identify potentially related entities
   * Detect repeated identities and connections
   * Reduce fragmented information

4. **Graph Analysis**

   * Build relationships between entities
   * Identify clusters and connected actors
   * Visualize the threat ecosystem

5. **Risk Analysis**

   * Calculate risk indicators
   * Identify high-risk entities
   * Prioritize investigations

6. **Analyst Interface**

   * Interactive graph
   * Actor profiles
   * Alerts
   * Intelligence overview

---

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript / TypeScript
* Modern UI components
* Interactive data visualization

### Backend

* Python
* FastAPI
* REST APIs

### AI / Intelligence

* NLP
* Entity Extraction
* Entity Resolution
* Graph Analysis
* Anomaly Detection
* Risk Scoring

### Data & Visualization

* Structured threat intelligence datasets
* Graph-based relationship visualization
* Analytics dashboards

> The exact technologies may evolve as the project continues to develop.

---

## 📊 Project Demonstration

The current prototype demonstrates how threat intelligence can be transformed into an interactive investigation environment.

Example intelligence view:

```text
                    ┌──────────────┐
                    │ Threat Actor │
                    │  ShadowX77   │
                    └───────┬──────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
       ┌─────────┐     ┌─────────┐     ┌─────────┐
       │ Alias   │     │ Wallet  │     │ Group   │
       └────┬────┘     └────┬────┘     └────┬────┘
            │               │               │
            └───────────────┼───────────────┘
                            ▼
                     Related Indicators
```

---

## 🔐 Responsible Use

UNMASK is intended for **cybersecurity research, threat intelligence, and defensive security analysis**.

The platform is designed to help security researchers and analysts understand relationships between threat indicators and prioritize investigations.

It should not be used to target, harass, expose, or harm individuals.

---

## 👥 Team — ROOTX

UNMASK is a collaborative project developed by **Team ROOTX**.

| Member               | Contribution                     |
| -------------------- | -------------------------------- |
| **Aman Kumar Singh** | Project Leadership & Development |
| **Abhay**            | Development & Integration        |
| **Raunak**           | Prototype & Development          |
| **Shayan**           | Prototype & Development          |
| **Pritha**           | Documentation & Communication    |
| **Aviral**           | Research & Documentation         |

> Team roles are based on the areas each member contributed to during the project.

---

## 📌 Project Information

**Project:** UNMASK — Dark Web Threat Actor Intelligence
**Team:** ROOTX
**Domain:** Cybersecurity & Blockchain
**Focus:** Dark Web Threat Intelligence
**Type:** Software / Research Prototype

---

## 🔮 Future Scope

We plan to extend UNMASK with:

* Real-time Dark Web monitoring
* More advanced entity resolution
* Automated threat actor profiling
* Larger intelligence datasets
* Advanced graph analytics
* Improved anomaly detection
* Threat intelligence feed integration
* Blockchain-based intelligence analysis
* More explainable AI-based risk scoring
* Collaboration features for security analysts

---

## ⚠️ Third-Party Resources

UNMASK may use third-party libraries, datasets, APIs, models, and other resources.

Each third-party resource remains subject to its respective license and terms of use.

Third-party licenses should be reviewed before redistributing datasets, models, or other externally sourced materials.

---

## 📄 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for details.

---

## ⭐ Support the Project

If you find UNMASK interesting or useful, consider giving the repository a ⭐ and exploring the project.

**Built with curiosity, cybersecurity, and a goal of making threat intelligence easier to understand.**

---

### UNMASK

**Observe. Connect. Analyze. Unmask.**
