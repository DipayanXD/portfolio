import { liquidGlass, glassButton } from './ui/liquid-glass.js';
import '../Css/calculator-toolbar.css';

(() => {
  const app = document.querySelector('.calculator');
  const display = app.querySelector('.display');
  const keypad = app.querySelector('.input');
  liquidGlass(app, { radius: '10px', blur: '16px', tint: '31,31,31', opacity: '.97', grain: false });
  const rows = [
    [['(', '('], [')', ')'], ['mc', 'mc'], ['m+', 'm+'], ['m−', 'm-'], ['mr', 'mr'], ['⌫', 'backspace'], ['AC', 'C'], ['%', '%'], ['÷', '/']],
    [['2ⁿᵈ', 'second'], ['x²', 'square'], ['x³', 'cube'], ['xʸ', '^'], ['eˣ', 'exp'], ['10ˣ', 'pow10'], ['7', '7'], ['8', '8'], ['9', '9'], ['×', '*']],
    [['¹⁄ₓ', 'reciprocal'], ['²√x', 'sqrt'], ['³√x', 'cbrt'], ['ʸ√x', 'root'], ['ln', 'ln'], ['log₁₀', 'log'], ['4', '4'], ['5', '5'], ['6', '6'], ['−', '-']],
    [['x!', 'factorial'], ['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'], ['e', 'e'], ['EE', 'EE'], ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+']],
    [['Rand', 'random'], ['sinh', 'sinh'], ['cosh', 'cosh'], ['tanh', 'tanh'], ['π', 'pi'], ['Rad', 'angle'], ['⁺⁄₋', '+/-'], ['0', '0'], ['.', '.'], ['=', '=']],
  ];
  // Use identical icon bounds so font baselines cannot offset operator symbols.
  const operatorPaths = {
    '/': '<path d="M4 12h16"/><circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
    '*': '<path d="m6 6 12 12M18 6 6 18"/>',
    '-': '<path d="M4 12h16"/>',
    '+': '<path d="M4 12h16M12 4v16"/>',
    '=': '<path d="M4 8h16M4 16h16"/>',
  };
  const labels = { second: 'Toggle inverse functions', square: 'Square', cube: 'Cube', '^': 'Power', exp: 'Exponential', pow10: 'Ten to the power', reciprocal: 'Reciprocal', sqrt: 'Square root', cbrt: 'Cube root', root: 'Nth root', ln: 'Natural logarithm', log: 'Base ten logarithm', factorial: 'Factorial', EE: 'Scientific notation', random: 'Random number', pi: 'Pi', angle: 'Toggle radians and degrees', '+/-': 'Change sign', C: 'All clear', backspace: 'Delete last digit', mc: 'Clear memory', 'm+': 'Add to memory', 'm-': 'Subtract from memory', mr: 'Recall memory' };
  rows.forEach(row => row.forEach(([label, value], column) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.value = value;
    button.textContent = label;
    if (operatorPaths[value]) button.innerHTML = `<svg class="calculator__operator-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${operatorPaths[value]}</svg>`;
    button.className = `button ${column === 9 ? 'operator' : column < 6 ? 'scientific' : ['backspace', 'C', '%'].includes(value) ? 'operator-2' : 'number'}`;
    button.title = labels[value] || label;
    button.setAttribute('aria-label', labels[value] || label);
    if (['second', 'angle'].includes(value)) button.setAttribute('aria-pressed', 'false');
    keypad.append(button);
    liquidGlass(button, { radius: '999px', blur: '16px', grain: false });
    glassButton(button);
  }));

  let entry = '0', tokens = [], fresh = false, resultShown = false, memory = 0, degrees = false, second = false;
  const history = [];
  const historyPanel = app.querySelector('.calculator__history');
  const historyList = app.querySelector('.calculator__history-list');
  const historyToggle = app.querySelector('.calculator__expression-toggle');
  const modeToggle = app.querySelector('.calculator__copy');
  const modeMenu = app.querySelector('.calculator__modes');
  const readable = list => list.map(t => ({ '*': '×', '/': '÷', root: 'ʸ√', EE: 'e' }[t] ?? t)).join(' ');
  function renderHistory() {
    historyList.replaceChildren();
    if (!history.length) historyList.textContent = 'No calculations yet';
    history.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${item.expression} = ${item.result}`;
      button.title = 'Use this result';
      button.addEventListener('click', () => {
        entry = item.result; tokens = []; fresh = true; resultShown = true; render();
      });
      historyList.append(button);
    });
  }
  const binary = ['+', '-', '*', '/', '^', 'root', 'EE'];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, EE: 2, '^': 3, root: 3 };
  const format = value => {
    if (!Number.isFinite(value)) throw new Error('Undefined result');
    return String(Number(value.toPrecision(12)));
  };
  function evaluate(list) {
    let index = 0;
    function expression(min = 0) {
      let left;
      const token = list[index++];
      if (token === '(') {
        left = expression();
        if (list[index++] !== ')') throw new Error('Close parentheses');
      } else {
        if (typeof token !== 'number') throw new Error('Incomplete expression');
        left = token;
      }
      while (index < list.length && precedence[list[index]] >= min) {
        const op = list[index++];
        const right = expression(precedence[op] + (['^', 'root'].includes(op) ? 0 : 1));
        left = op === '+' ? left + right : op === '-' ? left - right : op === '*' ? left * right : op === '/' ? left / right : op === '^' ? left ** right : op === 'EE' ? left * 10 ** right : left < 0 && Number.isInteger(right) && Math.abs(right % 2) === 1 ? -((-left) ** (1 / right)) : left ** (1 / right);
      }
      return left;
    }
    const value = expression();
    if (index !== list.length) throw new Error('Invalid expression');
    return value;
  }
  function commit() {
    if (!fresh) tokens.push(Number(entry));
  }
  function render() {
    display.value = entry;
    display.style.fontSize = entry.length > 20 ? '16px' : '';
    app.querySelector('.calculator__expression').textContent = tokens.map(t => ({ '*': '×', '/': '÷', root: 'ʸ√', EE: 'e' }[t] ?? t)).join(' ');
    app.querySelector('[value="mr"]').classList.toggle('is-active', memory !== 0);
  }
  function calculate(value) {
    try {
      if (value === 'C') { entry = '0'; tokens = []; fresh = false; resultShown = false; }
      else if (value === 'second' || value === 'angle') {
        if (value === 'second') second = !second; else degrees = !degrees;
        const button = app.querySelector(`[value="${value}"]`);
        button.setAttribute('aria-pressed', String(value === 'second' ? second : degrees));
        if (value === 'angle') button.textContent = degrees ? 'Deg' : 'Rad';
        if (value === 'second') ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh'].forEach(fn => {
          const key = app.querySelector(`[value="${fn}"]`);
          key.textContent = fn + (second ? '⁻¹' : '');
          key.setAttribute('aria-label', (second ? 'Inverse ' : '') + fn);
        });
      } else if (value === 'mc') memory = 0;
      else if (value === 'm+' || value === 'm-') memory = Number(format(memory + Number(entry) * (value === 'm+' ? 1 : -1)));
      else if (/^\d$/.test(value) || value === '.') {
        if (entry === 'Error' || resultShown) { tokens = []; fresh = true; resultShown = false; }
        if (fresh) { entry = '0'; fresh = false; }
        if (value === '.') { if (!entry.includes('.')) entry += '.'; }
        else if (entry.length < 16) entry = entry === '0' ? value : entry + value;
      } else if (value === 'backspace') {
        if (resultShown || entry === 'Error') { tokens = []; resultShown = false; }
        entry = fresh ? '0' : entry.slice(0, -1);
        if (!entry || entry === '-') entry = '0';
        fresh = false;
      } else if (binary.includes(value)) {
        if (resultShown) { tokens = []; fresh = false; resultShown = false; }
        commit();
        if (binary.includes(tokens.at(-1))) tokens[tokens.length - 1] = value;
        else tokens.push(value);
        fresh = true;
      } else if (value === '(') {
        if (resultShown) { tokens = []; resultShown = false; fresh = true; }
        if (!fresh && entry !== '0') { commit(); tokens.push('*'); }
        else if (tokens.at(-1) === ')') tokens.push('*');
        tokens.push('('); entry = '0'; fresh = true;
      } else if (value === ')') {
        commit(); tokens.push(')');
        let depth = 0, start = tokens.length - 1;
        for (; start >= 0; start--) {
          if (tokens[start] === ')') depth++;
          if (tokens[start] === '(' && --depth === 0) break;
        }
        if (start < 0) throw new Error('Unmatched parenthesis');
        entry = format(evaluate(tokens.slice(start))); fresh = true;
      } else if (value === '=') {
        if (!resultShown) {
          commit();
          const balance = tokens.filter(t => t === '(').length - tokens.filter(t => t === ')').length;
          for (let i = 0; i < balance; i++) tokens.push(')');
          entry = format(evaluate(tokens));
          history.unshift({ expression: readable(tokens), result: entry });
          if (history.length > 100) history.pop();
          renderHistory();
          tokens = []; fresh = true; resultShown = true;
        }
      } else {
        const x = Number(entry), angle = degrees ? x * Math.PI / 180 : x;
        const functions = { square: () => x ** 2, cube: () => x ** 3, exp: () => Math.exp(x), pow10: () => 10 ** x, reciprocal: () => 1 / x, sqrt: () => Math.sqrt(x), cbrt: () => Math.cbrt(x), ln: () => Math.log(x), log: () => Math.log10(x), '%': () => x / 100, '+/-': () => -x, pi: () => Math.PI, e: () => Math.E, random: () => Math.random(), mr: () => memory,
          factorial: () => { if (!Number.isInteger(x) || x < 0 || x > 170) throw new Error('Invalid factorial'); let n = 1; for (let i = 2; i <= x; i++) n *= i; return n; } };
        ['sin', 'cos', 'tan'].forEach(fn => { functions[fn] = () => second ? Math[`a${fn}`](x) * (degrees ? 180 / Math.PI : 1) : Math[fn](angle); });
        ['sinh', 'cosh', 'tanh'].forEach(fn => { functions[fn] = () => Math[`${second ? 'a' : ''}${fn}`](x); });
        if (!functions[value]) return;
        if (resultShown) { tokens = []; resultShown = false; }
        if (tokens.at(-1) === ')') {
          let depth = 0, start = tokens.length - 1;
          for (; start >= 0; start--) { if (tokens[start] === ')') depth++; if (tokens[start] === '(' && --depth === 0) break; }
          tokens.splice(start);
        }
        entry = format(functions[value]()); fresh = false;
      }
      render();
    } catch { entry = 'Error'; tokens = []; fresh = true; resultShown = true; render(); }
  }
  keypad.addEventListener('click', event => { const button = event.target.closest('button'); if (button) calculate(button.value); });
  document.addEventListener('keydown', event => {
    if (getComputedStyle(app).display === 'none' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.matches('input:not(.display), textarea, [contenteditable="true"]')) return;
    const frontWindows = [...document.querySelectorAll('.window, .calculator, .terminal, .note, .Vscode, .maps')].filter(win => getComputedStyle(win).display !== 'none');
    if (frontWindows.some(win => Number(win.style.zIndex) > Number(app.style.zIndex))) return;
    if (event.key === 'Escape' && !modeMenu.hidden) { setMenu(false); modeToggle.focus(); event.preventDefault(); return; }
    const value = { Enter: '=', Escape: 'C', Backspace: 'backspace', Delete: 'C', ',': '.' }[event.key] || event.key;
    const button = [...keypad.children].find(key => key.value === value);
    if (!button) return;
    event.preventDefault(); calculate(value);
    button.classList.add('is-pressed'); setTimeout(() => button.classList.remove('is-pressed'), 120);
  });
  app.querySelector('.max-cal').addEventListener('click', () => {
    const expanded = app.classList.toggle('calculator--expanded');
    app.querySelector('.max-cal').setAttribute('aria-pressed', String(expanded));
  });
  historyToggle.addEventListener('click', () => {
    historyPanel.hidden = !historyPanel.hidden;
    app.classList.toggle('calculator--history-open', !historyPanel.hidden);
    historyToggle.setAttribute('aria-expanded', String(!historyPanel.hidden));
    historyToggle.setAttribute('aria-label', historyPanel.hidden ? 'Show history' : 'Hide history');
    renderHistory();
  });
  app.querySelector('.calculator__clear-history').addEventListener('click', () => { history.length = 0; renderHistory(); });
  function setMenu(open) {
    modeMenu.hidden = !open;
    modeToggle.setAttribute('aria-expanded', String(open));
  }
  modeToggle.addEventListener('click', () => setMenu(modeMenu.hidden));
  ['basic', 'scientific'].forEach(mode => {
    app.querySelector(`[data-calculator-mode="${mode}"]`).addEventListener('click', () => {
      app.classList.toggle('calculator--basic', mode === 'basic');
      app.setAttribute('aria-label', mode === 'basic' ? 'Basic Calculator' : 'Scientific Calculator');
      ['basic', 'scientific'].forEach(option => app.querySelector(`[data-calculator-mode="${option}"]`).setAttribute('aria-pressed', String(option === mode)));
      setMenu(false); modeToggle.focus();
    });
  });
  document.addEventListener('click', event => { if (!modeMenu.contains(event.target) && !modeToggle.contains(event.target)) setMenu(false); });
})();
