import { createElement, Wifi, Bluetooth, Radio, Moon, PanelsTopLeft, ScreenShare, Sun, Volume2, VolumeX, Calculator, Timer, Camera, Play, Pause, SkipBack, SkipForward, ChevronRight, ChevronLeft, Check, X, CircleHelp, SlidersHorizontal, Monitor, Contrast, Headphones } from 'lucide';

const icons = { Wifi, Bluetooth, Radio, Moon, PanelsTopLeft, ScreenShare, Sun, Volume2, VolumeX, Calculator, Timer, Camera, Play, Pause, SkipBack, SkipForward, ChevronRight, ChevronLeft, Check, X, CircleHelp, SlidersHorizontal, Monitor, Contrast, Headphones };
const referenceSymbols = {
  AirDrop: '<circle cx="12" cy="11" r="2"/><path d="M8.8 15a5.2 5.2 0 1 1 6.4 0M6.5 17.4a8.5 8.5 0 1 1 11 0M12 14l-3 7h6z"/>',
  StageManager: '<rect x="8" y="5" width="14" height="14" rx="2"/><path d="M2 5h2v2H2zM2 11h2v2H2zM2 17h2v2H2z" fill="currentColor" stroke="none"/>',
  Mirroring: '<rect x="2" y="3" width="15" height="13" rx="2"/><rect x="7" y="7" width="15" height="14" rx="2"/>',
  Appearance: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18V3z" fill="currentColor"/><circle cx="12" cy="12" r="5" fill="none"/>',
  ReferenceTimer: '<circle cx="12" cy="12" r="9"/><path d="M12 5v3M12 12l-4-5"/>',
  SpeakerLow: '<path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor" stroke="none"/>',
  ReferenceCalculator: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 3v4h10V5H7zm0 7v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zm-8 4v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v4h2v-4h-2z"/>',
  ReferenceCamera: '<path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M6 9h3l1-2h4l1 2h3v8H6z"/><circle cx="12" cy="13" r="2.5"/>',
  Previous: '<path d="M11 5L2 12l9 7V5zm11 0l-9 7 9 7V5z" fill="currentColor" stroke="none"/>',
  Next: '<path d="M2 5l9 7-9 7V5zm11 0l9 7-9 7V5z" fill="currentColor" stroke="none"/>',
  ControlCenter: '<rect x="3" y="3" width="18" height="7" rx="3.5"/><circle cx="7" cy="6.5" r="1.5" fill="currentColor"/><rect x="3" y="14" width="18" height="7" rx="3.5"/><circle cx="17" cy="17.5" r="1.5" fill="currentColor"/>',
};
export const icon = (name) => referenceSymbols[name]
  ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${referenceSymbols[name]}</svg>`
  : createElement(icons[name], { width: 22, height: 22, 'stroke-width': 1.8, 'aria-hidden': 'true', fill: 'none' }).outerHTML;
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sample a damped physical spring once; Web Animations runs the resulting frames.
export function springFrames(render, { stiffness = 380, damping = 31, mass = .85 } = {}) {
  let position = 0, velocity = 0;
  const frames = [];
  for (let i = 0; i <= 60; i++) {
    frames.push({ ...render(position), offset: i / 60 });
    const acceleration = (stiffness * (1 - position) - damping * velocity) / mass;
    velocity += acceleration / 60;
    position += velocity / 60;
  }
  frames[60] = { ...render(1), offset: 1 };
  return frames;
}

export function liquidGlass(element, { radius = '22px', blur = '16px', tint = '255,255,255', opacity = '.09', depth = '0 3px 10px #0000000a', grain = true } = {}) {
  element.classList.add('liquid-glass');
  Object.entries({ '--glass-radius': radius, '--glass-blur': blur, '--glass-tint': tint, '--glass-opacity': opacity, '--glass-depth': depth }).forEach(([key, value]) => element.style.setProperty(key, value));
  element.classList.toggle('glass-grain', grain);
  let frame;
  element.addEventListener('pointermove', (event) => {
    if (reducedMotion() || frame) return;
    frame = requestAnimationFrame(() => {
      const bounds = element.getBoundingClientRect();
      element.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
      element.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
      frame = null;
    });
  });
  return element;
}

export function glassButton(element) {
  element.classList.add('glass-button');
  let reaction;
  element.addEventListener('pointerdown', () => {
    if (reducedMotion()) return;
    reaction?.cancel();
    reaction = element.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }], { duration: 90, fill: 'forwards' });
  });
  const release = () => {
    if (!reaction) return;
    reaction.cancel();
    reaction = element.animate(springFrames(p => ({ transform: `scale(${.96 + .04 * p})` })), { duration: 520 });
  };
  element.addEventListener('pointerup', release);
  element.addEventListener('pointercancel', release);
  element.addEventListener('pointerleave', release);
}

// Adapt the example's previous-option tracking to the desktop's existing buttons.
// One physical glass lens moves between options instead of swapping their fills.
export function glassSwitcher(group) {
  group.classList.add('cc-liquid-switcher');
  const options = [...group.querySelectorAll('button')];
  const lens = document.createElement('span');
  lens.className = 'cc-glass-selection';
  lens.setAttribute('aria-hidden', 'true');
  group.prepend(lens);
  let previous = null, animation;
  options.forEach((button, index) => button.setAttribute('c-option', String(index + 1)));
  const select = (value) => {
    const button = options.find(option => option.dataset.appearance === value);
    if (!button) return;
    const selected = button.getAttribute('c-option');
    const visible = group.getClientRects().length > 0;
    const old = visible && previous !== null ? lens.getBoundingClientRect() : null;
    animation?.cancel();
    const groupRect = group.getBoundingClientRect();
    const next = button.getBoundingClientRect();
    group.setAttribute('c-previous', previous ?? selected);
    group.setAttribute('c-current', selected);
    group.style.setProperty('--selected-index', String(options.indexOf(button)));
    if (visible) {
      lens.style.width = `${next.width}px`;
      lens.style.left = `${next.left - groupRect.left}px`;
      lens.style.transformOrigin = Number(selected) > Number(previous) ? 'left center' : 'right center';
      if (old && previous !== selected && !reducedMotion()) {
        const distance = old.left - next.left;
        const stretch = Math.min(.16, Math.abs(distance) / Math.max(next.width, 1) * .08);
        animation = lens.animate(springFrames(p => ({
          transform: `translateX(${distance * (1 - p)}px) scaleX(${1 + stretch * Math.sin(Math.PI * Math.min(1, Math.max(0, p)))})`,
        }), { stiffness: 340, damping: 28, mass: .8 }), { duration: 540 });
      }
    } else {
      lens.style.removeProperty('width');
      lens.style.removeProperty('left');
    }
    previous = selected;
  };
  new ResizeObserver(() => {
    if (group.getClientRects().length && previous) {
      const selected = options[Number(previous) - 1];
      lens.style.width = `${selected.offsetWidth}px`;
      lens.style.left = `${selected.offsetLeft}px`;
    }
  }).observe(group);
  return select;
}

export function glassSlider({ id, label, value, min = 0, max = 100, onInput }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'glass-slider';
  wrapper.innerHTML = `<div class="glass-slider-track"><span></span></div><input id="${id}" aria-label="${label}" type="range" min="${min}" max="${max}" step="1" value="${value}">`;
  const input = wrapper.querySelector('input');
  const update = () => {
    wrapper.style.setProperty('--fill', `${(Number(input.value) - min) / (max - min) * 100}%`);
    input.setAttribute('aria-valuetext', `${input.value}%`);
    onInput(Number(input.value));
  };
  input.addEventListener('input', update);
  wrapper.style.setProperty('--fill', `${(value - min) / (max - min) * 100}%`);
  input.setAttribute('aria-valuetext', `${value}%`);
  return wrapper;
}
