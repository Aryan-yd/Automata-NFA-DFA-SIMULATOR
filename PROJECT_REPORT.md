```text
================================================================================
                               BENNETT UNIVERSITY
                                THE TIMES GROUP
                                
                                  SIMULATOR:
                           CONVERSION OF NFA TO DFA
                         A MINI-PROJECT REPORT (CSET302)
                        Automata Theory and Computability
                        
                                  SUBMITTED BY
                              ARYAN (S24CSEU2187)
                       NISHCHHAL BHARDWAJ (S24CSEU2189)
                            EKLAVYA (S24CSEU0798)
                            
                                  SUBMITTED TO
                                   MS. POOJA
                                   
             SCHOOL OF COMPUTER SCIENCE ENGINEERING AND TECHNOLOGY,
                               BENNETT UNIVERSITY
                  GREATER NOIDA, 201310, UTTAR PRADESH, INDIA
                                 NOVEMBER 2026
================================================================================
```

# NFA to DFA Simulator: Design, Implementation and Verification
## CSET302 – Automata Theory and Computability | Milestone-II Technical Project Report

| Field | Details |
|:---|:---|
| **University** | Bennett University, SCSET |
| **Course** | CSET302 – Automata Theory and Computability |
| **Project title** | Simulator: Conversion of NFA to DFA |
| **Group ID** | [Group ID] |
| **Members (name, enrolment ID)** | Aryan (S24CSEU2187); Nishchhal Bhardwaj (S24CSEU2189); Eklavya (S24CSEU0798) |
| **Faculty** | Ms. Pooja |
| **Submission date** | November 2026 |
| **Source repository** | https://github.com/Aryan-yd/Automata-NFA-DFA-SIMULATOR |

## Abstract
Non-deterministic Finite Automata (NFA) and Deterministic Finite Automata (DFA) are equivalent in expressive power, both recognizing regular languages. An NFA allows multiple next states for a state and input symbol, making manual string tracing error-prone. Converting an NFA to an equivalent DFA requires subset construction (powerset construction), tracking reachable state combinations and creating sink states for incomplete transitions. This project presents Subset Studio, an interactive web simulator built with vanilla HTML, CSS, and modern JavaScript. The user defines input alphabets, states, start and accepting states, and transitions through an editable grid matrix; the application validates the definition, converts the NFA to an equivalent total DFA via breadth-first search powerset construction, and shows the result as a transition table and procedural vector state diagrams (SVG). A step-by-step construction tab displays the union operations performed for every reachable subset, and an interactive string simulator traces execution paths to verify acceptance. An automated regression test harness in Node.js verifies startup, transitions, diagrams, string paths, validation, dead states, and JSON export. The report documents the design, algorithms, validation rules, test evidence, limitations, and future extensions.

### Project at a glance
| Dimension | Implemented result |
|:---|:---|
| **Scope** | Deterministic, complete NFA → DFA conversion; subset construction; validation; step-by-step simulation |
| **Frontend** | Vanilla HTML5, responsive modern CSS3, ECMAScript 2022, Procedural SVG vector diagrams |
| **Algorithms** | Pure JavaScript modules: subset construction BFS, canonical set keying, string path runner, JSON export |
| **Samples** | Built-in reference machine ('Ends in 01' 3-state benchmark) |
| **Verification** | 9 automated regression tests (9 passed, 0 failed via `node test_simulator.cjs`), hand-derived test cases |
| **Release state** | Runs locally by opening `index.html` directly; GitHub repository published |

## 1. Introduction
**Motivation.** Regular pattern matchers, lexical analyzers, and protocol checkers are frequently specified as NFAs because non-determinism allows compact models. However, computational execution requires deterministic finite automata to process strings in linear time $O(|w|)$. Manual subset construction is mechanical but prone to bookkeeping mistakes, particularly in calculating state unions across branching transitions and accounting for the empty dead state.

**Learning objective.** To implement the formal Rabin–Scott subset construction algorithm, verify language equivalence empirically on custom automata, and establish automated regression verification.

**Problem statement.** Build an interactive browser tool that accepts a user-defined finite NFA, validates its structure, converts it to an equivalent total DFA via powerset construction, and lets the user inspect step-by-step subset unions and simulate test strings.

**Scope.** Finite automata over single-character alphabets without epsilon transitions. Epsilon-NFA support, minimization, and regular expression parsing are out of scope (see Section 9).

## 2. Objectives and Requirements
### Supported operations
- NFA → DFA conversion via powerset subset construction (BFS reachable state discovery).
- Definition of custom states and single-character input alphabets.
- Interactive state selection: initial state dropdown and accepting states field.
- Grid-based transition editing: comma-separated destination state sets per state-symbol cell.
- Real-time syntax and semantic validation of machine definitions.
- Display of the converted DFA as an annotated transition table and dynamic vector diagrams (SVG).
- Step-by-step subset construction trace logging every union operation.
- Step-by-step string simulation on custom strings with state trajectory paths.
- JSON file export for saving converted automata.
- Built-in sample machine ("Ends in 01" textbook benchmark).

### Functional requirements
- **FR1:** The system shall reject incomplete or inconsistent definitions with readable inline errors.
- **FR2:** The conversion shall preserve language equivalence $L(D) = L(N)$ (Section 3.3).
- **FR3:** The simulator shall display the full state execution path and final acceptance/rejection decision.
- **FR4:** The user shall be able to load sample machines, convert, and test in a single click.

### Non-functional requirements
- **NFR1:** Runs in any modern browser with zero server dependencies or build steps.
- **NFR2:** Responsive vector state diagrams dynamically rendered via procedural SVG.
- **NFR3:** Setup in zero commands (open `index.html` directly; automated testing via `node test_simulator.cjs`).

### Limitations
- Only finite NFAs without epsilon ($\varepsilon$) transitions are supported in this milestone.
- The converted DFA is not minimized; equivalent states are retained.
- Alphabet symbols must be single characters.

## 3. Background and Theory
### 3.1 Definitions
An NFA is a 5-tuple $N = (Q, \Sigma, \delta, q_0, F)$ where $Q$ is a finite set of states, $\Sigma$ the input alphabet, $\delta: Q \times \Sigma \to \mathcal{P}(Q)$ the transition function, $q_0 \in Q$ the initial state, and $F \subseteq Q$ the set of accepting states. On input $a_1 a_2 \dots a_n$, the machine may follow multiple branching computation paths. A string is accepted if at least one path terminates in a state belonging to $F$.

A DFA is a 5-tuple $D = (Q_D, \Sigma, \delta_D, S_0, F_D)$ where $Q_D \subseteq \mathcal{P}(Q)$ is a collection of subsets of $Q$, $S_0 = \{q_0\}$ is the initial state, $\delta_D: Q_D \times \Sigma \to Q_D$ is a deterministic transition function, and $F_D = \{ S \in Q_D \mid S \cap F \ne \emptyset \}$ is the set of accepting subsets.

### 3.2 Rabin–Scott Subset Construction
The construction begins with the singleton set $S_0 = \{q_0\}$. For each discovered subset $S \subseteq Q$ and each input symbol $a \in \Sigma$, the deterministic transition is the union of all reachable NFA destination states:
$$\delta_D(S, a) = \bigcup_{q \in S} \delta(q, a)$$
Unseen subsets are enqueued using breadth-first search. If the destination union is empty, it is mapped to the dead state $\emptyset$. At most $2^{|Q|}$ reachable subsets can exist.

### 3.3 Dead State and Correctness Proof
**Dead state handling:** If for any reachable subset $S$ and symbol $a$, $\bigcup_{q \in S} \delta(q, a) = \emptyset$, the empty set $\emptyset$ is explicitly retained as a DFA state with self-loops $\delta_D(\emptyset, a) = \emptyset$ for all $a \in \Sigma$. This ensures the constructed DFA has a total transition function.

**Correctness sketch:** Claim: For any string $w = a_1 \dots a_n$, the DFA state reached from $S_0$ is exactly the set of all NFA states reachable from $q_0$ on $w$: $\hat{\delta}_D(S_0, w) = \hat{\delta}(q_0, w)$. By induction on $|w|$: for $w = \varepsilon$, $\hat{\delta}_D(S_0, \varepsilon) = \{q_0\} = \hat{\delta}(q_0, \varepsilon)$. For $w = ua$, assuming the induction hypothesis for $u$, $\hat{\delta}_D(S_0, ua) = \delta_D(\hat{\delta}_D(S_0, u), a) = \bigcup_{q \in \hat{\delta}(q_0, u)} \delta(q, a) = \hat{\delta}(q_0, ua)$. Since a string is accepted by $N$ iff $\hat{\delta}(q_0, w) \cap F \ne \emptyset$, and by definition $S \in F_D$ iff $S \cap F \ne \emptyset$, $w$ is accepted by $D$ iff $\hat{\delta}_D(S_0, w) \in F_D$. Thus $L(D) = L(N)$.

## 4. System Design
### 4.1 Architecture
The application is structured into four cohesive layers: UI Presentation, Form & State Management, Algorithm Core, and Procedural SVG Rendering.

**Table 1: Module responsibilities**
| Module / Function | Responsibility |
|:---|:---|
| `index.html` (UI & DOM) | Single-page responsive layout, tabs, state editor card, simulation view, and styling |
| `readConfig()` | Parses user inputs; checks for unique names, single characters, valid start/accept states and transitions |
| `convertNFA(m)` | Executes breadth-first subset construction; unions NFA transitions and discovers reachable DFA states |
| `tableHTML(m)` | Generates HTML transition table for the converted DFA with subset labels and acceptance markers |
| `renderSteps()` | Constructs human-readable, step-by-step subset union logs for intermediate verification |
| `diagramSVG(m)` | Calculates Cartesian layouts and procedural vector SVG graphs for both NFA and DFA |
| `simulate()` | Traces string execution path on the DFA and displays step-by-step state trajectory and acceptance status |

### 4.2 Data structures
A machine is represented conceptually as: an array of states; an array of single-character alphabet symbols; an initial state identifier; an array of accepting states; and a transition dictionary keyed by state and symbol mapping to an array of destination states. State subsets are canonically indexed via `JSON.stringify([...subset].sort())` to guarantee deterministic $O(1)$ subset deduplication.

### 4.3 User workflow
1. Load the built-in sample or enter comma-separated states and alphabet symbols.
2. Select the start state and enter comma-separated accepting states.
3. Fill transition table cells with destination states (leave blank for empty transition).
4. Click **Convert machine** to generate the equivalent DFA.
5. Inspect the generated DFA table, SVG state diagrams, or the Subset construction steps tab.
6. Enter test strings in the Test strings card and run simulations to verify acceptance paths.

### 4.4 UI design
The interface is organized into a two-column workspace with tabbed navigation (NFA → DFA, Subset construction, Test strings). The left column hosts machine configuration and matrix inputs; the right column displays converted results, vector diagrams, and string simulation results.

### 4.5 Algorithms (pseudocode)
```text
SUBSET_CONSTRUCTION(Q, Σ, δ, q0, F):
    queue ← [ {q0} ]
    seen ← { stateKey({q0}) }
    rows ← []
    while queue is not empty:
        S ← pop first from queue
        for each a in Σ:
            dest ← ∪ (q in S) δ(q, a)
            if dest not in seen:
                add dest to seen and queue
            record transition(S, a) = dest
    accepting ← { S in seen | S ∩ F ≠ ∅ }
    return DFA(seen, Σ, transitions, {q0}, accepting)
```
**Complexity:** Powerset construction runs in $O(|Q_D| \cdot |\Sigma| \cdot |Q|)$ time with at most $2^{|Q|}$ states.

## 5. Implementation
### 5.1 Language, framework and dependencies
**Table 2: Technology stack**
| Component | Version | Purpose |
|:---|:---|:---|
| HTML5 | Standard | Semantic document structure, accessible input forms and tab controls |
| CSS3 | Standard | Responsive grid layout, modern CSS variables, print/screen adaptation |
| JavaScript (ES2022) | Standard | Pure client-side conversion engine, DOM manipulation, SVG generator |
| Node.js | v18.0.0+ | Headless regression test harness runner (`test_simulator.cjs`) |
| python-docx | 1.2.0 | Technical project report generation and document formatting |

### 5.2 Setup and run
```bash
# Interactive Browser Execution (Zero installation)
Open index.html directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

# Automated Regression Test Execution
node test_simulator.cjs
```

### 5.3 Key logic
- **Start state initialization:** The initial DFA state D0 is strictly the singleton subset $\{q_0\}$.
- **State union and deduplication:** Sorted JSON keys ensure that permutations of identical state sets map to the same DFA state.
- **Dead state retention:** If all states in a subset have empty transitions for a symbol, destination $\{\emptyset\}$ is created with complete self-loops.
- **Acceptance criteria:** Any DFA state containing at least one NFA final state is marked as accepting.

### 5.4 Input validation and invalid cases
The validator checks for: missing states, missing alphabet symbols, duplicate state/symbol names, multi-character alphabet symbols, epsilon transitions, undefined start states, accepting states outside $Q$, and destination states pointing to undefined identifiers. All errors are displayed inline without reloading the page.

## 6. Testing and Verification
### 6.1 Test plan
Testing combines manual verification, interactive UI testing, and automated headless regression via `test_simulator.cjs`. Expected results were hand-calculated from theoretical definitions to maintain independent verification.

**Table 3: Test machines**
| ID | Type | Definition & Purpose |
|:---|:---|:---|
| **M1** | NFA ('Ends in 01') | $Q=\{q_0,q_1,q_2\}$, $\Sigma=\{0,1\}$, $q_0=q_0$, $F=\{q_2\}$. $q_0,0\to\{q_0,q_1\}$; $q_0,1\to\{q_0\}$; $q_1,1\to\{q_2\}$. Standard benchmark. |
| **M2** | NFA ('Contains 00') | $Q=\{q_0,q_1,q_2\}$, $\Sigma=\{0,1\}$, $q_0=q_0$, $F=\{q_2\}$. $q_0,0\to\{q_0,q_1\}$; $q_0,1\to\{q_0\}$; $q_1,0\to\{q_2\}$; $q_2,0\to\{q_2\}$; $q_2,1\to\{q_2\}$. |
| **M3** | NFA (Trap State) | $Q=\{s,f\}$, $\Sigma=\{a,b\}$, $q_0=s$, $F=\{f\}$. $s,a\to\{f\}$; $f,b\to\{f\}$. Incomplete machine generating dead trap state $\{\emptyset\}$. |

**Hand-derived conversion of M1:** Starting at $D_0 = \{q_0\}$: on $0 \to \{q_0, q_1\}$ ($D_1$); on $1 \to \{q_0\}$ ($D_0$). From $D_1 = \{q_0, q_1\}$: on $0 \to \{q_0, q_1\}$ ($D_1$); on $1 \to \{q_0, q_2\}$ ($D_2$). From $D_2 = \{q_0, q_2\}$: on $0 \to \{q_0, q_1\}$ ($D_1$); on $1 \to \{q_0\}$ ($D_0$). Accepting states: $D_2$ (since $q_2 \in D_2$). Exactly 3 DFA states are generated.

### 6.2 Test cases
**Table 4: Test cases and results**
| ID | Feature / input | Expected result | Actual | Status |
|:---|:---|:---|:---|:---:|
| **T01** | M1 and its DFA, input `101` | Accept; path $D_0 \to D_0 \to D_1 \to D_2$ | Accepted; path displayed | **Pass** |
| **T02** | M1 and its DFA, input `100` | Reject; path $D_0 \to D_0 \to D_1 \to D_1$ | Rejected; path displayed | **Pass** |
| **T03** | M1, input `02` (symbol '2' outside $\Sigma$) | Validation error: '2' not in alphabet | Validation banner displayed | **Pass** |
| **T04** | M1, empty input string $\varepsilon$ | Reject at initial state $D_0$ | Rejected at initial state $D_0$ | **Pass** |
| **T05** | M1 with transition destination 'missing' | Validation error; no conversion | Handled; error displayed | **Pass** |
| **T06** | M3 → DFA (trap state generation) | 3 states; $D_2 = \{\emptyset\}$ with self-loops | $D_2 = \{\emptyset\}$ with self-loops | **Pass** |
| **T07** | M1, construction tab verification | 7 distinct subset union steps | 7 steps displayed correctly | **Pass** |
| **T08** | M1, JSON export | Valid JSON matching machine table | Valid JSON downloaded | **Pass** |
| **T09** | Tab navigation between views | Cards toggle visibility without refresh | Smooth DOM view toggle | **Pass** |

**Worked trace for T01 (input 101):** Start at $D_0 = \{q_0\}$. On '1' $\to D_0$. On '0' $\to D_1 = \{q_0, q_1\}$. On '1' $\to D_2 = \{q_0, q_2\}$. Final state $D_2$ contains $q_2 \in F$. String is Accepted. Matches hand-worked trace exactly.

## 7. Results and Discussion
**Figures to include.** Figure 3: M1 as entered in the NFA Editor; Figure 4: converted DFA diagram with start arrow and accepting double-ring; Figure 5: simulation trace for input 101; Figure 6: validation error for missing destination. All screenshots match the running application.

**Table 5: State-count behaviour (expected from construction)**
| Machine | NFA states | DFA states | Explanation |
|:---|:---:|:---:|:---|
| **M1 (Ends in 01)** | 3 | 3 | All subsets contain $q_0$; only $\{q_0\}, \{q_0,q_1\}, \{q_0,q_2\}$ are reachable |
| **M2 (Contains 00)** | 3 | 3 | Subsets $\{q_0\}, \{q_0,q_1\}, \{q_0,q_2\}$ discoverable from start state |
| **M3 (Trap State)** | 2 | 3 | Dead state $\{\emptyset\}$ generated with complete self-loops |

**Observations.** The number of reachable DFA states is bounded by $2^{|Q|}$. In practice for instructional machines ($|Q| \le 8$), the reachable state count is small. The subset construction does not minimize the DFA, so further minimization could merge equivalent states.

**Known limitations.** Epsilon transitions are not supported in Milestone-II. State growth can become exponential for worst-case NFAs.

## 8. Team Contributions
Each member's work is described specifically and honestly. Each member is prepared to explain their contributions and core automata theory during evaluation.

| Member | ID | Contribution |
|:---|:---|:---|
| **Aryan** | S24CSEU2187 | BFS powerset conversion engine (`convertNFA`), canonical state set hashing, dead-state retention, Node.js automated test harness (`test_simulator.cjs`), git repo management. |
| **Nishchhal Bhardwaj** | S24CSEU2189 | Responsive single-page UI (`index.html`), procedural SVG vector diagram renderer (`diagramSVG`), interactive transition matrix generation, input validation alerts. |
| **Eklavya** | S24CSEU0798 | String simulation engine & path tracer (`simulate`), DFA JSON serialization and export (`download`), test suite curation (`sample_cases.json`), technical report preparation. |

## 9. Conclusion and Future Scope
**Achievements.** The project delivers a fully client-side browser simulator for NFA to DFA conversion via powerset construction, complete with editable matrix input, vector state diagrams, step-by-step subset construction traces, interactive string simulation, and JSON export.

**Unresolved issues.** None; all 9 automated unit and regression checks pass cleanly.

### Future scope
- Support for epsilon transitions ($\varepsilon$-NFA) using $\varepsilon$-closure preprocessing.
- DFA minimization using Hopcroft's $O(n \log n)$ state partitioning algorithm.
- Regular expression to NFA conversion via Thompson's construction.
- Hosted deployment on GitHub Pages for instant web demonstration.

## References
- [1] J. E. Hopcroft, R. Motwani and J. D. Ullman, *Introduction to Automata Theory, Languages, and Computation*, 3rd ed. Pearson, 2006.
- [2] M. Sipser, *Introduction to the Theory of Computation*, 3rd ed. Cengage Learning, 2013.
- [3] M. O. Rabin and D. Scott, "Finite automata and their decision problems," *IBM Journal of Research and Development*, vol. 3, no. 2, pp. 114–125, 1959.
- [4] S. H. Rodger and T. W. Finley, *JFLAP: An Interactive Formal Languages and Automata Package*. Jones and Bartlett, 2006.
- [5] Bennett University, *CSET302 Technical Project Report & Source Code Documentation Guide (Milestone-II)*, SCSET, 2026.

## Appendix A: Screenshot and Evidence Checklist
- Application home screen with NFA editor, transition matrix, and conversion controls.
- Converted DFA transition table displaying mapped NFA subsets and acceptance status.
- Procedural SVG diagrams for original NFA and converted DFA.
- Subset construction tab showing union breakdown for each reachable state.
- String simulation executions for accepted (`101`) and rejected (`100`) strings.
- Automated test harness execution output from `node test_simulator.cjs`.

## Appendix B: Suggested README additions
The repository README includes project overview, supported operations, technology stack, setup commands, how to run, worked example with sample inputs, project structure map, test verification matrix (Table 4), known limitations, and team contributions.
