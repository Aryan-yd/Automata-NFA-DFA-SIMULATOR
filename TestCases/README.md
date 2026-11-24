# Test Cases & Verification Suite
**CSET302: Automata Theory and Computability**  
**Milestone-II Test Documentation**

---

## 1. Overview
This directory contains the testing suite, sample automata test vectors, and automated verification scripts for the NFA-to-DFA Simulator.

## 2. Directory Contents
- `test_simulator.cjs`: Headless Node.js DOM-emulated regression test harness verifying 9 core behavioral invariants.
- `sample_cases.json`: Structured definitions of reference automata, transition rules, and expected input string evaluations.

## 3. How to Run the Tests

To run the automated regression tests:
```bash
node test_simulator.cjs
```

Expected output:
```text
PASS startup builds transition table, DFA table, and both diagrams
PASS built-in example generates the hand-calculated DFA transitions
PASS string acceptance and rejection paths work
PASS invalid alphabet symbols are reported
PASS unreachable transition destinations are rejected
PASS empty subset is included and has complete self-loops
PASS construction tab displays one transition step for every DFA state and symbol
PASS DFA JSON export contains the converted table
PASS view tabs reveal the selected content
All simulator checks passed.
```

---

## 4. Test Matrix (Milestone-II Standard)

| Test ID | Category | Feature / Input | Expected Result | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| **T01** | Functional | Accepted string `101` on "Ends in 01" machine | Accept with trace: `D0 → D0 → D1 → D2` | Accept with trace: `D0 → D0 → D1 → D2` | **PASS** |
| **T02** | Functional | Rejected string `100` on "Ends in 01" machine | Reject with trace: `D0 → D0 → D1 → D1` | Reject with trace: `D0 → D0 → D1 → D1` | **PASS** |
| **T03** | Boundary / Validation | Unknown symbol `2` in binary alphabet (`02`) | Input validation error: symbol not in alphabet | Validation error rendered | **PASS** |
| **T04** | Boundary | Empty string $\varepsilon$ simulation | Rejects string at initial state `D0` | Rejects string at initial state `D0` | **PASS** |
| **T05** | Error Handling | Transition destination pointing to undefined state | Error: `Unknown destination` | Throws error; blocks conversion | **PASS** |
| **T06** | Mathematical Invariant | Transition leading to empty set $\emptyset$ | Subset $\emptyset$ added with deterministic self-loops | Added as `D2 = {∅}` with self-loops | **PASS** |
| **T07** | Construction Steps | Step-by-step breakdown inspection | 7 distinct union steps rendered | 7 steps verified in DOM | **PASS** |
| **T08** | Interoperability | Download converted DFA JSON | Valid JSON with `states`, `alphabet`, `transitions` | JSON generated and validated | **PASS** |
| **T09** | UI / DOM | Tab view switching (`convert`, `steps`, `simulate`) | Visual cards toggle visibility without page refresh | Correct cards shown/hidden | **PASS** |