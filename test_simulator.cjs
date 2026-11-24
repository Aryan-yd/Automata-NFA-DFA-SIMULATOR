const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

class Element {
  constructor(id = '') {
    this.id = id;
    this.value = '';
    this.dataset = {};
    this.options = [];
    this.handlers = {};
    this._innerHTML = '';
    this.textContent = '';
    this.className = '';
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name),
      toggle: (name, force) => {
        const add = force === undefined ? !this.classes.has(name) : force;
        if (add) this.classes.add(name); else this.classes.delete(name);
        return add;
      }
    };
  }
  set innerHTML(value) {
    this._innerHTML = value;
    if (this.id === 'tableHost') {
      document.inputs = [...value.matchAll(/<input\b([^>]*)>/g)].map(([, attrs]) => {
        const attr = name => attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? '';
        const el = new Element();
        el.dataset = { state: attr('data-state'), input: attr('data-input') };
        el.value = attr('value').replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
        return el;
      });
    }
  }
  get innerHTML() { return this._innerHTML; }
  set value(v) { this._value = v; }
  get value() { return this._value ?? (this.options[0]?.value ?? ''); }
  addEventListener(name, fn) { this.handlers[name] = fn; }
  append(child) { this.options.push(child); if (this.options.length === 1 && !this._value) this._value = child.value; }
  click() { this.clicked = true; }
}

const ids = ['states','alphabet','start','accept','tableHost','message','resultHost','resultPill','diagramSection','simResult','sequenceInput','originalDiagram','convertedDiagram','editorCard','simCard','convertBtn','exampleBtn','downloadBtn','simulateBtn'];
const elements = Object.fromEntries(ids.map(id => [id, new Element(id)]));
elements.states.value = 'q0,q1,q2'; elements.alphabet.value = '0,1'; elements.accept.value = 'q2'; elements.sequenceInput.value = '101';
const tabs = ['convert','steps','simulate'].map(view => { const e = new Element(); e.dataset.view = view; return e; });
const made = [];
global.document = {
  inputs: [],
  getElementById: id => elements[id],
  createElement: tag => { const e = new Element(tag); made.push(e); return e; },
  querySelectorAll: selector => selector === '[data-state]' ? document.inputs : selector === '.tab' ? tabs : []
};
let capturedBlob;
global.URL = { createObjectURL: blob => { capturedBlob = blob; return 'blob:test'; }, revokeObjectURL: () => {} };
global.Blob = class { constructor(parts) { this.parts = parts; } };

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInThisContext(script, { filename: 'index.html inline script' });

function test(name, fn) { fn(); console.log(`PASS ${name}`); }
test('startup builds transition table, DFA table, and both diagrams', () => {
  assert.match(elements.resultHost.innerHTML, /D0/);
  assert.match(elements.resultHost.innerHTML, /D2/);
  assert.match(elements.originalDiagram.innerHTML, /<svg[\s\S]*<circle/);
  assert.match(elements.convertedDiagram.innerHTML, /<svg[\s\S]*<circle/);
  assert.match(elements.convertedDiagram.innerHTML, /<path/);
});
test('built-in example generates the hand-calculated DFA transitions', () => {
  const tbody = elements.resultHost.innerHTML.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
  const rows = [...tbody.matchAll(/<tr><th>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
  assert.equal(rows.length, 3);
  assert.match(rows[0], /D1/); assert.match(rows[0], /D0/);
  assert.match(rows[1], /D1/); assert.match(rows[1], /D2/);
  assert.match(rows[2], /Yes/);
});
test('string acceptance and rejection paths work', () => {
  elements.sequenceInput.value = '101'; simulate();
  assert.match(elements.simResult.innerHTML, /Accepted/);
  assert.match(elements.simResult.innerHTML, /D0.*D0.*D1.*D2/);
  elements.sequenceInput.value = '01'; simulate();
  assert.match(elements.simResult.innerHTML, /Accepted/);
  elements.sequenceInput.value = '100'; simulate();
  assert.match(elements.simResult.innerHTML, /Rejected/);
  elements.sequenceInput.value = '0001'; simulate();
  assert.match(elements.simResult.innerHTML, /Accepted/);
  elements.sequenceInput.value = ''; simulate();
  assert.match(elements.simResult.innerHTML, /Rejected/);
});
test('invalid alphabet symbols are reported', () => {
  elements.sequenceInput.value = '02'; simulate();
  assert.match(elements.simResult.textContent, /not in the alphabet/);
});
test('unreachable transition destinations are rejected', () => {
  elements.sequenceInput.value = '101';
  const q1zero = document.inputs.find(x => x.dataset.state === 'q1' && x.dataset.input === '0');
  q1zero.value = 'missing';
  assert.throws(() => readConfig(), /Unknown destination/);
  loadExample();
});
test('empty subset is included and has complete self-loops', () => {
  elements.states.value = 's,f'; elements.alphabet.value = 'a,b'; elements.accept.value = 'f';
  tableMemory = Object.create(null);
  tableMemory[JSON.stringify(['s','a'])] = 'f';
  tableMemory[JSON.stringify(['s','b'])] = '';
  tableMemory[JSON.stringify(['f','a'])] = '';
  tableMemory[JSON.stringify(['f','b'])] = 'f';
  renderStart(); renderInputTable(); elements.start.value = 's'; convert();
  assert.match(elements.resultHost.innerHTML, /∅/);
  assert.equal(elements.resultPill.textContent, '3 DFA states');
  assert.match(elements.resultHost.innerHTML, /D2 <span class="state-list">\{∅\}<\/span><\/td><td>D2/);
  assert.match(elements.convertedDiagram.innerHTML, /<circle/);
});
test('construction tab displays one transition step for every DFA state and symbol', () => {
  loadExample();
  const steps = renderSteps();
  assert.equal((steps.match(/class="step"/g) || []).length, 7);
  assert.match(steps, /D1 = \{q0, q1\} on 1/);
});
test('DFA JSON export contains the converted table', () => {
  loadExample(); download();
  const link = made.at(-1);
  assert.equal(link.download, 'converted-dfa.json');
  assert.equal(link.clicked, true);
  const out = JSON.parse(capturedBlob.parts[0]);
  assert.equal(out.start, 'D0');
  assert.deepEqual(out.accept, ['D2']);
  assert.equal(out.transitions.D1['1'], 'D2');
});
test('view tabs reveal the selected content', () => {
  loadExample();
  tabs.find(t => t.dataset.view === 'steps').handlers.click();
  assert.match(elements.resultHost.innerHTML, /Initialize/);
  assert.ok(elements.simCard.classes.has('hidden'));
  tabs.find(t => t.dataset.view === 'simulate').handlers.click();
  assert.ok(elements.editorCard.classes.has('hidden'));
  assert.ok(!elements.simCard.classes.has('hidden'));
  tabs.find(t => t.dataset.view === 'convert').handlers.click();
  assert.match(elements.resultHost.innerHTML, /DFA state/);
});
console.log('All simulator checks passed.');
