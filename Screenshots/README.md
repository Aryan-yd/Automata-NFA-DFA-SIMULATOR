# Visual Walkthrough & Screenshots Guide
**CSET302: Automata Theory and Computability**  
**Milestone-II Simulator Screenshots & Visual Architecture**

---

## 1. UI Layout Overview
The user interface adopts a responsive two-column layout with a purple header and clean workspace cards:
- **Left Column:** Machine editor, state configuration, alphabet input, initial and accepting state selectors, dynamic transition matrix, and conversion action buttons.
- **Right Column:** Generated DFA transition table, state status pill, vector SVG state diagrams, interactive string simulation card, and algorithm summary.

```text
+---------------------------------------------------------------------------------+
|                       NFA -> DFA Simulator (Header)                             |
+---------------------------------------------------------------------------------+
| [NFA -> DFA (Active)]   [Subset construction]   [Test strings]                  |
+---------------------------------------+-----------------------------------------+
| Left Column: NFA Editor               | Right Column: Converted Results         |
| - States: q0, q1, q2                  | - Generated DFA Table (D0, D1, D2)      |
| - Alphabet: 0, 1                      | - State Diagrams:                       |
| - Start: q0 | Accept: q2              |   [Original NFA]   [Converted DFA]      |
| - Transition Grid:                    | - String Simulation Card:               |
|   q0 on 0 -> {q0, q1}                 |   Input: [101] -> [Run simulation]      |
|   q0 on 1 -> {q0}                     |   Result: ACCEPTED                      |
|   q1 on 1 -> {q2}                     |   Path: D0 -> D0 -> D1 -> D2            |
| [Convert] [Load example] [JSON]       |                                         |
+---------------------------------------+-----------------------------------------+
```

---

## 2. Key Screen Features

### A. Machine Input & Validation
- **Dynamic Grid:** When states or alphabet symbols are modified, the transition matrix automatically updates in real time.
- **Inline Validation Banner:** If an invalid state (e.g. unknown destination `q5`) or multi-character symbol is entered, a highlighted error banner alerts the user and prevents malformed conversions.

### B. Converted DFA Transition Table
- **Subset Mapping:** Displays each generated DFA state with its corresponding NFA subset (e.g., `D0 = {q0}`, `D1 = {q0, q1}`, `D2 = {q0, q2}`).
- **Initial and Final Markers:** Initial state indicated by `→ D0`; accepting states highlighted with green `Yes` tags.

### C. State Diagrams (Dynamic SVG)
- **NFA Graph:** Multi-arc vector diagram showing branching transitions from `q0` to both `q0` and `q1`.
- **DFA Graph:** Deterministic state graph showing transitions between `D0`, `D1`, and `D2` with initial start arrow and green double circle on final state `D2`.

### D. Step-by-Step Subset Construction View
- Clicking the **Subset construction** tab displays numbered step cards detailing each union operation:
  - `Initialize: D0 = {q0}`
  - `D0 = {q0} on 0: union of destinations = {q0, q1} -> D1`
  - `D0 = {q0} on 1: union of destinations = {q0} -> D0`
  - `D1 = {q0, q1} on 0: union of destinations = {q0, q1} -> D1`
  - `D1 = {q0, q1} on 1: union of destinations = {q0, q2} -> D2`
  - `D2 = {q0, q2} on 0: union of destinations = {q0, q1} -> D1`
  - `D2 = {q0, q2} on 1: union of destinations = {q0} -> D0`

### E. Interactive String Simulation View
- Test strings (e.g. `101`, `100`, `01`, `0001`, empty string $\varepsilon$) can be tested with instant visual feedback:
  - **Accepted String (`101`):** Displays bold green badge **Accepted** and interactive path pills:
    `D0 = {q0} → D0 = {q0} → D1 = {q0, q1} → D2 = {q0, q2}`
  - **Rejected String (`100`):** Displays bold red badge **Rejected** and trajectory ending in non-accepting state `D1`.

---

## 3. Visual Verification Evidence
All features run natively in Google Chrome, Microsoft Edge, Mozilla Firefox, and Safari on Windows, Linux, and macOS. Live demonstrations can be verified by opening `index.html` in any web browser.