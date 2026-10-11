const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function calculator() {
  const keys = [];
  const display = { value: '0', style: {} };
  const expression = {};
  const listeners = {};
  const element = () => ({ style: {}, classList: { toggle() {}, add() {}, remove() {} }, setAttribute() {}, addEventListener() {}, replaceChildren() {}, append() {} });
  const keypad = { children: keys, append: button => keys.push(button), addEventListener: (name, fn) => { listeners[name] = fn; } };
  const app = { ...element(), querySelector: selector => selector === '.display' ? display : selector === '.input' ? keypad : selector === '.calculator__expression' ? expression : keys.find(key => selector === `[value="${key.value}"]`) || element() };
  vm.runInNewContext(fs.readFileSync(`${__dirname}/calculator.js`, 'utf8').replace(/^import .*;\r?\n/gm, ''), {
    liquidGlass() {}, glassButton() {},
    document: { querySelector: () => app, createElement: element, addEventListener() {} },
  });
  return (...values) => {
    for (const value of values) {
      const button = keys.find(key => key.value === value);
      assert.ok(button, `Missing key: ${value}`);
      listeners.click({ target: { closest: () => button } });
    }
    return display.value;
  };
}

test('arithmetic respects precedence and nested parentheses', () => {
  const press = calculator();
  assert.equal(press('2', '+', '3', '*', '4', '='), '14');
  assert.equal(press('C', '(', '2', '+', '(', '3', '*', '4', ')', ')', '='), '14');
  assert.equal(press('C', '(', '2', '+', '3', ')', 'square', '*', '2', '='), '50');
  assert.equal(press('C', '2', '^', '3', '^', '2', '='), '512');
});
test('scientific functions, roots, signs and percentages', () => {
  const press = calculator();
  assert.equal(press('9', 'sqrt'), '3');
  assert.equal(press('C', '2', '7', 'root', '3', '='), '3');
  assert.equal(press('C', '2', '7', '+/-', 'root', '3', '='), '-3');
  assert.equal(press('C', '5', 'factorial'), '120');
  assert.equal(press('C', '5', '0', '%'), '0.5');
  assert.equal(press('C', '2', 'EE', '3', '='), '2000');
  assert.equal(press('C', 'angle', '9', '0', 'sin'), '1');
  assert.equal(press('second', 'sin'), '90');
  assert.equal(press('C', '1', '0', '0', 'log'), '2');
});
test('memory persists through clear and recalls into expressions', () => {
  const press = calculator();
  assert.equal(press('8', 'm+', 'C', '2', 'm-', 'C', '3', '+', 'mr', '='), '9');
  assert.equal(press('mc', 'C', 'mr'), '0');
});
test('decimal entry, editing, operator replacement and error recovery', () => {
  const press = calculator();
  assert.equal(press('.', '5', '.', 'backspace', '2', '+', '*', '5', '='), '1');
  assert.equal(press('+', '4', '='), '5');
  assert.equal(press('C', '1', '/', '0', '='), 'Error');
  assert.equal(press('7', '+', '2', '='), '9');
  assert.equal(press('C', '9', '+/-', 'sqrt'), 'Error');
  assert.equal(press('C', '5', '+', '='), 'Error');
});
