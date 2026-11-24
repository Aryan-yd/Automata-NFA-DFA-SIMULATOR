# Source Code Documentation & Architecture
**CSET302: Automata Theory and Computability**  
**Milestone-II Code Documentation**

---

## 1. Overview
The simulator is implemented as a self-contained, standalone web application in `index.html`. It incorporates HTML5 semantic structure, modern CSS3 styling, and modular JavaScript (ES2022).

## 2. Source Files
- `index.html`: Complete simulator source code containing the DOM layout, styling rules, and JavaScript engine.

## 3. Function & Module Reference

| Function | Purpose | Parameters | Returns / Effects |
|:---|:---|:---|:---|
| `splitCSV(s)` | Splits comma-separated strings into trimmed tokens | `s: string` | `string[]` of non-empty tokens |
| `uniq(a)` | Deduplicates array elements | `a: Array` | Array of unique items |
| `esc(s)` / `escAttr(s)` | Escapes HTML entities to protect against XSS | `s: string` | Sanitized string |
| `stateKey(s)` | Computes canonical key for state sets (sorted JSON) | `s: Iterable<string>` | Deterministic JSON string |
| `setLabel(s)` | Formats state set in mathematical notation | `s: Iterable<string>` | Human-readable string e.g. `{q0, q1}` or `{∅}` |
| `renderStart()` | Populates start state dropdown options | None | Updates `#start` select element |
| `renderInputTable()`| Generates dynamic matrix inputs for states $\times$ alphabet | None | Renders `#tableHost` |
| `readConfig()` | Reads and validates user inputs against formal rules | None | Validated NFA model object |
| `convertNFA(m)` | Executes powerset construction via BFS | `m: Object` (NFA) | Converted DFA object with rows & subsets |
| `convert()` | Orchestrates validation, conversion, and DOM rendering | None | Updates application state & views |
| `tableHTML(m)` | Renders converted DFA transition table | `m: Object` (DFA) | HTML table markup |
| `renderSteps()` | Generates step-by-step subset union cards | None | HTML step cards markup |
| `diagramSVG(m)` | Computes coordinates and renders procedural SVG graphs | `m: Object` (Automaton) | SVG graph markup |
| `simulate()` | Simulates string on DFA and tracks state trajectory | None | Displays Accepted/Rejected badge & path |
| `download()` | Serializes DFA into JSON and triggers client download | None | Prompts file download `converted-dfa.json` |
| `loadExample()` | Populates built-in "Ends in 01" reference NFA | None | Loads sample data and runs `convert()` |

## 4. Algorithmic Characteristics
- **Algorithm:** Powerset construction via Breadth-First Search (BFS).
- **Time Complexity:** $O(|Q_D| \cdot |\Sigma| \cdot |Q|)$, where $|Q_D| \le 2^{|Q|}$ is the number of reachable DFA subsets.
- **Space Complexity:** $O(|Q_D| \cdot |\Sigma|)$ to store the transition matrix.
- **Dead State Handling:** Explicitly adds $\emptyset$ to the subset queue when transitions are empty, creating self-loops on all alphabet symbols so the resulting DFA is total.