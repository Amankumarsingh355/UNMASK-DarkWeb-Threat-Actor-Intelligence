# National Cyber Defense Initiative (NTRO) 2026
## PROJECT REPORT: UNMASK

================================================================================
PROJECT DETAILS
================================================================================
* Project Name: UNMASK
* Problem Statement ID: 26151
* Problem Statement Title: Dark Web Threat Actor De-anonymization
* Theme: Blockchain & Cybersecurity
* Category: Software
* Team ID: TID-384
* Team Name: RootX
* Target Users: Cyber Crime Investigators, Law Enforcement Agencies, Defense Analysts

================================================================================
1. EXECUTIVE SUMMARY (THE BIG PICTURE)
================================================================================
Imagine a criminal committing a crime in City A under the name "John", then moving to City B and calling himself "Mike", using a burner phone, and paying with cash. To catch him, an investigator has to connect his voice, writing habits, travel timings, and hidden money trails.

On the Dark Web, cybercriminals (hackers, ransomware gangs, drug traffickers) do the exact same thing:
- They use Tor and VPNs to hide their IP addresses.
- They change their usernames across different underground forums (e.g., "ShadowX" on Forum A, "RootNinja" on Forum B).
- They use cryptocurrency mixers to hide their illicit money.

Because of this, police officers and cyber intelligence teams spend weeks manually searching across thousands of dark web forums, notes, and crypto ledgers.

OUR SOLUTION:
UNMASK is an AI-powered cyber intelligence platform. It collects data from dark web forums, crypto blockchains, and server records, connects the hidden dots using 5 different digital clues, and builds an interactive 3D visual map. It shows investigators with mathematical proof which anonymous handles are likely the same person or syndicate.

================================================================================
2. THE PROBLEM (WHY EXISTING METHODS FAIL)
================================================================================
When investigating dark web crimes, police and intelligence agencies face 4 major roadblocks:

1. Identity Fragmentation:
A single criminal creates 10 different fake names across Telegram, underground forums, and darknet markets.

2. Crypto Money Laundering:
Adversaries use mixers (tumblers) to break Bitcoin and Ethereum transaction trails across multiple wallet hops.

3. Massive Data Overload:
There are millions of dark web posts, timestamps, PGP keys, and wallet addresses. A human analyst cannot remember or connect them all.

4. Slow Manual Process:
Manually comparing writing styles, transaction hashes, and forum login times takes 2 to 3 weeks for a single case.

================================================================================
3. OUR SOLUTION: HOW UNMASK WORKS (THE 5-PILLAR APPROACH)
================================================================================
UNMASK does not guess or use a "black box". It looks at 5 specific digital clues that criminals accidentally leave behind:

--------------------------------------------------------------------------------
PILLAR 1: Cryptographic Key Matching (PGP Proof)
--------------------------------------------------------------------------------
- What happens: Dark web users sign messages with PGP keys to build trust.
- How UNMASK catches them: Even if a hacker changes their username, they often reuse the same 4096-bit PGP master key or subkey. UNMASK instantly matches the mathematical fingerprint.

--------------------------------------------------------------------------------
PILLAR 2: Writing Style & Stylometrics (AI Language Clues)
--------------------------------------------------------------------------------
- What happens: Everyone has a unique way of writing (sentence length, slang, punctuation, missing commas).
- How UNMASK catches them: Our AI reads their forum posts, converts their writing style into a linguistic profile, and finds matches across completely different forums with 80%+ accuracy.

--------------------------------------------------------------------------------
PILLAR 3: Blockchain & Crypto Trail Analysis
--------------------------------------------------------------------------------
- What happens: Hackers receive ransom in crypto and move it through multiple wallets.
- How UNMASK catches them: UNMASK traces Ethereum and Bitcoin ledgers across multi-hop transactions, detecting when money from different usernames ends up in the same deposit wallet or mixer.

--------------------------------------------------------------------------------
PILLAR 4: Temporal Timing & Timezone Sync
--------------------------------------------------------------------------------
- What happens: Hackers have biological sleep and work schedules.
- How UNMASK catches them: UNMASK charts the exact hours and days a user is active. If two different usernames only post between 10:00 PM and 3:00 AM UTC on weekends, they share the same operational schedule.

--------------------------------------------------------------------------------
PILLAR 5: Infrastructure & Server Linkage
--------------------------------------------------------------------------------
- What happens: Criminals host websites on bulletproof servers and Tor onion services.
- How UNMASK catches them: UNMASK correlates shared server IPs, SSH host keys, and domain registrations.

================================================================================
4. THE COMPLETE SYSTEM PIPELINE
================================================================================
Here is how raw data turns into an actionable case file in UNMASK:

Step 1: Data Ingestion
Lawfully obtained forum text, crypto transaction logs, and PGP dumps are loaded into the system.

Step 2: AI Entity Extraction
The AI automatically extracts usernames, crypto wallets (0x...), email addresses, onion domains, and IP addresses.

Step 3: Multi-Signal Scoring Engine
UNMASK calculates a correlation score between 0% and 100% using the formula:
Score = (PGP Match) + (Wallet Flow) + (Writing Style) + (Username Similarity) + (Timing Overlap)

Step 4: 3D Visual Threat Graph
The system draws an interactive 3D WebGL network map where investigators can see the criminal in the center connected to all their fake names, wallets, and servers.

Step 5: Explainable Evidence & AI Analyst
UNMASK tells the investigator EXACTLY why a connection was made (e.g., "+30% from shared Ethereum transaction, +25% from PGP key match, +20% from writing style").

Step 6: 1-Click Official Dossier
The investigator reviews the evidence, approves the link, and clicks "Print Dossier" to generate a formal court-ready PDF briefing.

================================================================================
5. CORE FEATURES OF THE WORKING PROTOTYPE
================================================================================
1. Tactical Command Center:
A real-time dashboard displaying active threat actors, high-risk targets, total monitored crypto volume, and critical alert feeds.

2. Global Omni-Search (Ctrl + K):
A unified search bar that searches across threat actors, aliases, crypto wallets (0x...), onion domains, IP addresses, and forensic case numbers in under 1 second.

3. 3D WebGL Threat Topology:
An interactive 3D graph built with Three.js. Investigators can rotate, zoom, click any node, filter by confidence score, and visually trace multi-hop criminal networks.

4. UNMASK ANALYST AI:
A built-in AI assistant trained on cyber forensics. Analysts can ask questions like "Who is ShadowX77 connected to?" and receive instant answers with verified evidence hashes.

5. Actor Dossier & Stylometric Radar:
Detailed profiles showing risk ratings (e.g., 87/100 High Risk), 24-hour activity clocks, radar charts of vocabulary traits, and linked cases.

6. Multi-Hop Pivot Investigation Engine:
Allows the investigator to jump step-by-step:
Actor A --> Forum Alias --> Email --> Crypto Wallet --> Mixer --> Actor B.

================================================================================
6. TECHNICAL ARCHITECTURE & STACK
================================================================================
* Frontend:
  - React 19, TypeScript, Vite (Fast, reliable, responsive UI)
  - Three.js WebGL (Hardware-accelerated 3D graph rendering at 60 FPS)
  - Tailwind CSS (Clean, high-contrast dark mode for operations centers)

* Backend & AI:
  - Python 3.11 & FastAPI (High-speed asynchronous REST APIs)
  - PyTorch & Hugging Face Transformers (NLP stylometrics and entity extraction)
  - Scikit-learn (Timezone clustering and anomaly detection)

* Databases:
  - Neo4j (Graph database for mapping multi-hop connections)
  - PostgreSQL (Relational database for cases, user access, and audit logs)
  - Redis (In-memory caching for sub-millisecond searches)

* Security & Governance:
  - SHA-256 evidence hashing (Ensures evidence is tamper-proof)
  - Role-Based Access Control (RBAC) (Strict clearance levels for officers)
  - Human-in-the-Loop design (AI recommends leads, human officers make the final legal decision)

================================================================================
7. KEY INNOVATIONS: WHY UNMASK IS UNIQUE
================================================================================
Comparison Table:

| Capability                  | Traditional Manual Way | Existing Tools        | UNMASK Platform         |
|-----------------------------|------------------------|-----------------------|-------------------------|
| Investigation Time          | 2 to 3 Weeks           | 24 to 48 Hours        | Under 2 Seconds         |
| Cross-Domain Matching       | None (Isolated Notes)  | Keyword search only   | 5-Pillar AI Fusion      |
| Visualization               | Flat Excel / 2D Charts | Basic 2D nodes        | Interactive 3D WebGL    |
| Writing Style Analysis      | Manual reading         | Not included          | Automated NLP AI        |
| Crypto Mixer Tracing        | Separate expensive tool| Basic lookup          | Built-in Graph Tracing  |
| Explainability (Why linked?)| Analyst intuition      | Black-box score       | 100% Transparent Proof  |
| Report Generation           | 8+ hours manual typing | Generic text dump     | 1-Click Formal Dossier  |

================================================================================
8. LEGAL, ETHICAL & SAFETY SAFEGUARDS
================================================================================
1. Correlation != Legal Attribution:
UNMASK clearly states that mathematical correlation is an investigative lead, not absolute proof. Final attribution requires police subpoenas and legal warrants.

2. Complete Evidence Provenance:
Every clue is sealed with an immutable SHA-256 cryptographic hash so it can be verified in a court of law.

3. Ethical Data Handling:
The system is built for authorized cyber defense, law enforcement, and research on lawfully obtained datasets.

================================================================================
9. EXPECTED IMPACT & OUTCOMES
================================================================================
* 90% Time Reduction: Compresses multi-week manual investigations into minutes.
* Actionable Intelligence: Helps national security teams intercept ransomware operations and financial fraud before damage spreads.
* Zero Licensing Cost: Built on an open-source, modern technology stack that does not require proprietary multi-lakh commercial licenses.

================================================================================
10. CONCLUSION
================================================================================
Dark web threat actors rely on anonymity, pseudonymity, and fragmentation to escape justice. UNMASK breaks this advantage by connecting cryptographic, behavioral, financial, and temporal clues into a single, explainable 3D intelligence graph.

It gives law enforcement and cyber defense agencies an intuitive, lightning-fast, and court-ready platform to turn dark web chaos into clear, actionable evidence.

================================================================================
                          END OF PROJECT REPORT
================================================================================
