# Subset Studio: NFA to DFA Simulator (Milestone-II)
**Course:** CSET302 — Automata Theory and Computability  
**Institution:** Bennett University (SCSET)  
**Evaluation:** Milestone-II Final Demonstration & Evaluation  
**Faculty:** Pooja  
**Submission Date:** 25 November 2026  
**Project Team Members:**
- **Aryan** (Lead Developer, Enrolment ID: S24CSEU2187, GitHub: [@Aryan-yd](https://github.com/Aryan-yd))
- **Nishchhal Bhardwaj** (UI / UX & Visualization Developer, Enrolment ID: S24CSEU2189)
- **Eklavya** (Simulation Engine & Testing Lead, Enrolment ID: S24CSEU0798)  

---

## Overview: What does the simulator do?

**Subset Studio** is an interactive, browser-based Automata Theory simulator that converts any Non-deterministic Finite Automaton (NFA) into an equivalent Deterministic Finite Automaton (DFA) using the formal **subset construction algorithm** (Rabin–Scott powerset construction).

An NFA allows non-deterministic branching, where a single state and input symbol can transition to zero, one, or multiple candidate states. Subset Studio solves the challenge of manually tracing branching computation paths by:
1. Validating formal 5-tuple input specifications $(\Sigma, Q, q_0, F, \delta)$.
2. Automatically computing reachable power-set states (canonical subsets).
3. Generating complete DFA transition tables and interactive step-by-step subset construction traces.
4. Rendering clean, proportional SVG state-transition diagrams for both the original NFA and the converted DFA.
5. Simulating arbitrary input strings with live step-by-step state path tracking and formal acceptance/rejection decisions.
6. Exporting the converted DFA structure as standard JSON.

The entire application runs client-side with zero dependencies, requiring no build tools, web servers, or third-party libraries.

---

## Supported features: list implemented operations

- **NFA Definition & Editing:** Dynamic transition table editor for arbitrary states, single-character alphabets, starting state selection, and multiple accepting states.
- **Powerset / Subset Construction (BFS):** Reachable subset exploration starting from $\{q_0\}$, systematically discovering new DFA states.
- **Dead / Trap State Handling:** Explicit detection and retention of the empty set $\emptyset$ with complete self-loops, guaranteeing that the generated DFA is total.
- **Equivalence Verification & String Simulation:** Trace execution paths on the constructed DFA for any user-supplied string, reporting whether the string is Accepted or Rejected.
- **Dynamic Vector Diagrams (SVG):** Inline rendering of both NFA and DFA state graphs with start arrows and double-ring final states.
- **Construction Trace:** Numbered, human-readable breakdown of every subset union operation performed.
- **JSON Export:** Download the converted machine specification in a structured format for interoperability.
- **Automated Regression Suite:** Complete Node.js headless DOM test harness checking 9 core invariants.

---

## Technology stack and dependencies: versions

- **Core Application:**
  - **HTML5:** Semantic layout with ARIA accessibility labels (`aria-live`, `aria-label`).
  - **CSS3:** Modern CSS variables, flexbox, and responsive grid layouts (desktop and mobile adaptive).
  - **JavaScript (ECMAScript 2022):** Pure vanilla JavaScript without external libraries or frameworks.
  - **SVG (Scalable Vector Graphics):** Procedurally calculated dynamic transition graphs.
- **Testing & Verification:**
  - **Node.js (v18.0.0+ / v20+ / v24+):** Built-in `node:assert`, `node:vm`, `node:fs`, and `node:path`.
- **Zero External Dependencies:** No npm packages, bundlers, or internet connectivity needed.

---

## Installation: numbered setup commands

No installation is needed to use the simulator. To clone and run tests locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aryan-yd/Automata-NFA-DFA-SIMULATOR.git
   cd Automata-NFA-DFA-SIMULATOR
   ```

2. **Verify Node.js installation (for automated tests):**
   ```bash
   node -v
   ```

3. **Run the test suite:**
   ```bash
   node test_simulator.cjs
   ```

---

## How to run: exact command and entry point

### Option 1: Browser Entry Point (Interactive UI)
Simply open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari):
- **Windows (PowerShell):**
  ```powershell
  Start-Process index.html
  ```
- **macOS:**
  ```bash
  open index.html
  ```
- **Linux:**
  ```bash
  xdg-open index.html
  ```

### Option 2: Automated Regression Testing (Terminal)
Run the regression harness:
```bash
node test_simulator.cjs
```
All 9 unit and integration tests will execute and report passing status.

---

## Example: sample automaton definition, input and output

### Sample NFA: Recognizes strings ending in `01`
- **States:** `q0, q1, q2`
- **Alphabet:** `0, 1`
- **Start State:** `q0`
- **Accepting States:** `q2`
- **NFA Transition Table:**
  - `q0` on `0` $\to \{q0, q1\}$; on `1` $\to \{q0\}$
  - `q1` on `0` $\to \emptyset$; on `1` $\to \{q2\}$
  - `q2` on `0` $\to \emptyset$; on `1` $\to \emptyset$

### Resulting Converted DFA:
| DFA State | NFA Subset | on `0` | on `1` | Accepting? |
|:---:|:---:|:---:|:---:|:---:|
| **$\to$ D0** | $\{q0\}$ | D1 | D0 | No |
| **D1** | $\{q0, q1\}$ | D1 | D2 | No |
| **D2** | $\{q0, q2\}$ | D1 | D0 | **Yes** |

### Sample Simulation Traces:
- Input `101`: Path `D0 → D0 → D1 → D2` $\implies$ **Accepted** (D2 contains $q_2 \in F$).
- Input `100`: Path `D0 → D0 → D1 → D1` $\implies$ **Rejected** (D1 does not contain $q_2$).
- Input `01`: Path `D0 → D1 → D2` $\implies$ **Accepted**.
- Empty string $\varepsilon$: Path `D0` $\implies$ **Rejected**.

---

## Project structure: modules and responsibilities

```text
Automata-NFA-DFA-SIMULATOR/
├── index.html                   # Root entry point for browser & GitHub Pages
├── README.md                    # Main project documentation (Milestone-II guide compliant)
├── PROJECT_REPORT.md            # Complete academic technical report (Markdown)
├── Technical_Project_Report.docx # Complete academic technical report (Word DOCX)
├── test_simulator.cjs           # Regression testing suite for Node.js
├── .gitignore                   # Ignored files and system artifacts
├── Report/
│   ├── Technical_Project_Report.docx # Formatted editable Word DOCX report
│   ├── PROJECT_REPORT.md        # Technical Project Report in prescribed structure
│   └── Guide.pdf                # University documentation & milestone guide
├── SourceCode/
│   ├── index.html               # Documented source code (HTML, CSS, JS engine)
│   └── README.md                # Architecture overview, data structures & function index
├── TestCases/
│   ├── test_simulator.cjs       # Standalone test runner
│   ├── sample_cases.json        # Machine-readable test definitions & test matrix
│   └── README.md                # Test execution instructions and verification table
└── Screenshots/
    └── README.md                # Visual walkthrough, UI screenshots & state diagrams
```

### Module Responsibilities:
1. **Input & Validation Module (`readConfig`, `syncInput`):** Sanitizes state names, validates unique symbols, enforces single-character alphabet, and verifies that transitions reference defined states.
2. **Subset Construction Engine (`convertNFA`):** Implements powerset discovery via Breadth-First Search (BFS), calculates transition unions $\delta_D(S, a) = \bigcup_{q \in S} \delta(q, a)$, and assigns deterministic state identifiers (`D0`, `D1`, ...).
3. **Presentation & DOM Renderer (`tableHTML`, `renderSteps`, `renderResult`):** Formats conversion results into dynamic HTML tables and step-by-step breakdown cards.
4. **Graph Generator (`diagramSVG`):** Calculates multi-row Cartesian coordinates and generates standard vector diagrams (SVG) for both machines.
5. **String Simulation Engine (`simulate`):** Traverses the converted DFA step-by-step according to the input string and determines acceptance status.
6. **Data Serialization (`download`):** Encodes the resulting DFA into JSON for external usage.

---

## Testing: command, test data and expected behavior

Execute tests using:
```bash
node test_simulator.cjs
```

### Test Verification Matrix (as per Guide Template):
| Test ID | Feature / Input | Expected Result | Actual Result | Status |
|:---:|:---|:---|:---|:---:|
| **T01** | Standard DFA simulation: accepted string (`101`) | Accept; Path: `D0 → D0 → D1 → D2` | Accept; Path displayed | **PASS** |
| **T02** | Standard DFA simulation: rejected string (`100`) | Reject; Path: `D0 → D0 → D1 → D1` | Reject; Path displayed | **PASS** |
| **T03** | Unknown symbol in input string (`02`) | Validation error: `symbol "2" not in alphabet` | Validation message displayed | **PASS** |
| **T04** | Empty string $\varepsilon$ simulation | Correct result based on start state (`D0` $\implies$ Reject) | Rejected at initial state `D0` | **PASS** |
| **T05** | Unknown transition destination in input | Validation error: `Unknown destination` | Handled; Error thrown and shown | **PASS** |
| **T06** | Empty subset / dead trap state discovery | Reached state $\emptyset$ included with full self-loops | Empty state `{∅}` with complete self-loops | **PASS** |
| **T07** | Step-by-step construction tab verification | 7 distinct union steps for 3-state machine | 7 steps displayed correctly | **PASS** |
| **T08** | DFA JSON Export | Valid JSON structure with states, alphabet, transitions | Download triggered with valid JSON | **PASS** |
| **T09** | Tab view switching | Correct UI cards toggled without page reload | Smooth DOM tab transition | **PASS** |

---

## Known limitations and troubleshooting

1. **Epsilon Transitions ($\varepsilon$-NFA):** The current release supports finite NFAs without $\varepsilon$-transitions. Future updates will incorporate $\varepsilon$-closure preprocessing.
2. **Exponential State Growth:** Theoretical upper bound of subset construction is $2^{|Q|}$. For very large NFAs ($|Q| > 15$), the number of reachable subsets may cause high memory or rendering usage.
3. **DFA Minimization:** The constructed DFA contains all reachable states but is not minimized. Equivalent states are not merged (DFA minimization via Hopcroft's algorithm is scheduled for Milestone-III).
4. **Troubleshooting Tips:**
   - *Table cells empty:* Click **Load example** to populate standard working values.
   - *State not recognized:* Ensure states and alphabet symbols do not contain commas or spaces within names.

---

## Team contributions and acknowledgements

### Project Team (CSET302):
- **Aryan (`Aryan-yd`)** — Core Conversion Engine & Automation:
  - Formulated and implemented the Breadth-First Search (BFS) powerset construction engine (`convertNFA`).
  - Implemented canonical state-key hashing and dead-state ($\emptyset$) retention logic.
  - Authored automated Node.js regression test harness (`test_simulator.cjs`) and managed repository publishing.

- **Nishchhal Bhardwaj** — User Interface & Procedural Visualization:
  - Designed the responsive single-page layout, styling, and color schemes (`index.html`).
  - Developed the procedural SVG vector diagram renderer (`diagramSVG`) for both NFA and DFA graphs.
  - Implemented dynamic input matrix rendering and client-side validation alerts (`readConfig`, `syncInput`).

- **Eklavya** — Simulation Engine & Verification:
  - Implemented the deterministic string simulation engine and interactive path tracer (`simulate`).
  - Built the DFA JSON serialization and file export module (`download`).
  - Prepared the test case suite (`sample_cases.json`), verification matrices, and assisted with technical report editing.

### Acknowledgements:
- **Bennett University, School of Computer Science Engineering and Technology (SCSET)** for the CSET302 curriculum guidelines.
- **JFLAP Team** for providing academic reference benchmarks in formal language simulators.