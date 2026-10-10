import { icon, liquidGlass, glassButton, glassSlider, glassSwitcher, springFrames, reducedMotion } from './ui/liquid-glass.js';
import './control-center.css';

const $ = (selector, root = document) => root.querySelector(selector);
const state = { controlCenterOpen: false, wifiEnabled: true, bluetoothEnabled: true, airdropEnabled: true, focusEnabled: false, stageEnabled: false, brightness: 66, volume: 81, appearance: localStorage.getItem('theme') || 'system', mediaPlaying: false };
const systemAppearance = matchMedia('(prefers-color-scheme: light)');
const tracks = [
  { title: 'Besties', subtitle: 'Black Country, New Road', url: new URL('../music/audio/aurora-vale.wav', import.meta.url).href },
  { title: 'Glass Atlas', subtitle: 'Portfolio Sessions · Ambient', url: new URL('../music/audio/glass-atlas.wav', import.meta.url).href },
  { title: 'Harbor Lights', subtitle: 'Portfolio Sessions · Ambient', url: new URL('../music/audio/harbor-lights.wav', import.meta.url).href }
];
let trackIndex = 0;
const audio = new Audio(tracks[0].url);
audio.preload = 'none';
audio.volume = state.volume / 100;
const host = $('.open_control');
host.classList.remove('hidden');
host.replaceChildren();
const trigger = document.createElement('button');
trigger.className = 'cc-trigger';
trigger.setAttribute('aria-label', 'Control Center');
trigger.setAttribute('aria-expanded', 'false');
trigger.setAttribute('aria-controls', 'control-center');
trigger.innerHTML = icon('ControlCenter');
host.append(trigger);

const panel = document.createElement('section');
panel.id = 'control-center';
panel.className = 'cc-panel';
panel.hidden = true;
panel.setAttribute('role', 'dialog');
panel.setAttribute('aria-label', 'Control Center');
panel.innerHTML = `
  <header class="cc-heading" hidden><span>Control Center</span><button class="cc-dismiss" aria-label="Close Control Center">${icon('X')}</button></header>
  <div class="cc-grid">
    <section class="cc-connectivity cc-module" data-module="network">
      <div class="cc-network-main"><button class="cc-wifi cc-circle" aria-label="Toggle Wi-Fi" aria-pressed="true">${icon('Wifi')}</button><button class="cc-network-expand cc-text" aria-label="Show connectivity options" aria-expanded="false"><strong>Wi-Fi</strong><small class="cc-wifi-status">Home</small></button></div>
      <div class="cc-network-circles"><button class="cc-circle cc-bluetooth" aria-label="Toggle Bluetooth" aria-pressed="true">${icon('Bluetooth')}</button><button class="cc-circle cc-airdrop" aria-label="Toggle AirDrop discovery demo" aria-pressed="true">${icon('AirDrop')}</button></div>
      <div class="cc-details" hidden><div class="cc-detail-heading">Connectivity <span>Portfolio session</span></div><div class="cc-detail-row">${icon('Wifi')}<span>Portfolio network<small class="cc-connection-detail">Online · Available for collaboration</small></span>${icon('Check')}</div><p>These controls change this desktop’s demo state. Your device connection stays as it is.</p><div class="cc-detail-row">${icon('Bluetooth')}<span>Bluetooth<small class="cc-bluetooth-status">Discoverable</small></span></div><div class="cc-detail-row">${icon('Radio')}<span>AirDrop<small class="cc-airdrop-status">Discovery off</small></span></div></div>
    </section>
    <section class="cc-media cc-module" data-module="media">
      <button class="cc-media-expand" aria-label="Expand ambience player" aria-expanded="false"><div class="cc-artwork"><span hidden>BC</span></div><strong class="cc-song">Besties</strong><small class="cc-artist">Black Country, New Road</small></button>
      <div class="cc-transport"><button data-media="previous" aria-label="Previous track">${icon('Previous')}</button><button data-media="play" aria-label="Play ambience" aria-pressed="false">${icon('Play')}</button><button data-media="next" aria-label="Next track">${icon('Next')}</button></div>
      <div class="cc-details" hidden><div class="cc-playback"><span class="cc-elapsed">0:00</span><span class="cc-duration">—</span></div><div class="cc-seek-slot"></div><p>Reference artwork and metadata. Playback uses original portfolio ambience.</p><p class="cc-media-status" role="status"></p></div>
    </section>
    <button class="cc-focus cc-module" aria-label="Toggle Focus mode" aria-pressed="false"><span class="cc-mini-circle">${icon('Moon')}</span><span><strong>Focus</strong><small class="cc-focus-status">Off</small></span></button>
    <div class="cc-secondary"><button class="cc-stage cc-circle cc-module" aria-label="Toggle Stage Manager" aria-pressed="false" title="Stage Manager">${icon('StageManager')}</button><button class="cc-mirror cc-circle cc-module" aria-label="Show portfolio preview selector" aria-expanded="false" title="Portfolio previews">${icon('Mirroring')}</button></div>
    <section class="cc-display cc-module cc-wide" data-module="display"><div class="cc-slider-heading"><button aria-label="Show display options" aria-expanded="false">Display ${icon('ChevronRight')}</button><output id="cc-brightness-value">66%</output></div><div class="cc-slider-row">${icon('Sun')}<div class="cc-brightness-slot"></div>${icon('Sun')}</div><div class="cc-details" hidden><div class="cc-detail-heading">Desktop appearance</div><div class="cc-segmented"><button data-appearance="light">Light</button><button data-appearance="dark">Dark</button><button data-appearance="system">Auto</button></div><button id="bgToggle" class="cc-option">${icon('Monitor')}<span>Live wallpaper</span></button></div></section>
    <section class="cc-sound cc-module cc-wide" data-module="sound"><div class="cc-slider-heading"><button aria-label="Show sound output options" aria-expanded="false">Sound ${icon('ChevronRight')}</button><output id="cc-volume-value">81%</output></div><div class="cc-slider-row">${icon('SpeakerLow')}<div class="cc-volume-slot"></div>${icon('Volume2')}<button class="cc-output" aria-label="Show sound output options" aria-expanded="false">${icon('AirDrop')}</button></div><div class="cc-details" hidden><div class="cc-detail-heading">Output</div><div class="cc-detail-row">${icon('Volume2')}<span>Browser audio<small>Your device’s selected output</small></span>${icon('Check')}</div><button class="cc-option cc-mute">${icon('VolumeX')}<span>Mute ambience</span></button><p>Volume controls the portfolio ambience player.</p></div></section>
    <section class="cc-previews cc-module cc-wide" hidden><div class="cc-detail-heading">Portfolio previews <button class="cc-preview-close" aria-label="Close preview selector">${icon('X')}</button></div><button class="cc-option" data-preview=".open-note">${icon('PanelsTopLeft')}<span>About & notes</span>${icon('ChevronRight')}</button><button class="cc-option" data-preview=".open-photos">${icon('Camera')}<span>Achievements</span>${icon('ChevronRight')}</button><button class="cc-option" data-preview=".open-terminal">${icon('Monitor')}<span>Developer terminal</span>${icon('ChevronRight')}</button></section>
    <div class="cc-quick cc-wide"><button class="cc-circle cc-appearance" aria-label="Change appearance" title="Appearance">${icon('Appearance')}</button><button class="cc-circle cc-calculator" aria-label="Open Calculator" title="Calculator">${icon('ReferenceCalculator')}</button><button class="cc-circle cc-timer" aria-label="Open Timer" title="Timer">${icon('ReferenceTimer')}</button><button class="cc-circle cc-camera" aria-label="Open Camera" title="Camera">${icon('ReferenceCamera')}</button></div>
  </div><footer class="cc-footer"><button class="cc-edit-controls" aria-label="Edit Controls">Edit Controls</button><span class="cc-session-status" role="status" hidden>Your desktop, your flow.</span></footer>`;
document.body.append(panel);
liquidGlass(panel, { radius: '30px', blur: '16px', tint: '28,34,48', opacity: '.30', depth: '0 24px 65px #00000035, 0 5px 15px #00000018' });
panel.querySelectorAll('.cc-module, .cc-quick .cc-circle, .cc-network-circles .cc-circle').forEach(el => liquidGlass(el, { radius: el.classList.contains('cc-circle') ? '50%' : '22px', blur: '5px' }));
liquidGlass($('.cc-network-main', panel), { radius: '40px', blur: '8px', opacity: '.07' });
panel.querySelectorAll('button').forEach(glassButton);
$('.cc-brightness-slot', panel).append(glassSlider({ id: 'brightness', label: 'Display brightness', min: 20, value: state.brightness, onInput: value => { state.brightness = value; $('#cc-brightness-value').value = `${value}%`; document.documentElement.style.setProperty('--desktop-dim', (100 - value) / 100 * .75); } }));
$('.cc-volume-slot', panel).append(glassSlider({ id: 'sound', label: 'Ambience volume', value: state.volume, onInput: value => { state.volume = value; audio.volume = value / 100; $('#cc-volume-value').value = `${value}%`; } }));
$('.cc-seek-slot', panel).append(glassSlider({ id: 'cc-seek', label: 'Track position', value: 0, onInput: value => { if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * value / 100; } }));
const dim = document.createElement('div');
dim.className = 'cc-desktop-dim';
document.body.append(dim);
document.documentElement.style.setProperty('--desktop-dim', (100 - state.brightness) / 100 * .75);

let panelAnimation;
function positionPanel() {
  const rect = trigger.getBoundingClientRect();
  const right = 12;
  panel.style.right = `${right}px`;
  panel.style.top = `${rect.bottom + 18}px`;
  panel.style.setProperty('--origin-x', `${rect.left + rect.width / 2 - (innerWidth - right - panel.offsetWidth)}px`);
}
function setOpen(open, restoreFocus = false) {
  if (state.controlCenterOpen === open) return;
  state.controlCenterOpen = open;
  panelAnimation?.cancel();
  trigger.setAttribute('aria-expanded', String(open));
  panel.inert = !open;
  panel.style.pointerEvents = open ? 'auto' : 'none';
  if (open) { panel.hidden = false; positionPanel(); }
  if (restoreFocus) trigger.focus({ preventScroll: true });
  const mobile = innerWidth <= 520;
  const frames = open ? springFrames(p => ({ transform: `translateY(${(1 - p) * (mobile ? 28 : -12)}px) scale(${.94 + .06 * p})`, opacity: Math.min(1, Math.max(0, p * 1.8)), filter: `blur(${Math.max(0, (1 - p) * .8)}px)` })) : [{ transform: 'translateY(0) scale(1)', opacity: 1 }, { transform: `translateY(${mobile ? 20 : -12}px) scale(.94)`, opacity: 0 }];
  panelAnimation = panel.animate(reducedMotion() ? [{ opacity: open ? 0 : 1 }, { opacity: open ? 1 : 0 }] : frames, { duration: reducedMotion() ? 120 : open ? 340 : 190, easing: open ? 'linear' : 'cubic-bezier(.5,0,.85,.5)' });
  panelAnimation.onfinish = () => { if (!state.controlCenterOpen) panel.hidden = true; };
  if (open) {
    if (!reducedMotion()) panel.querySelectorAll('.cc-grid > :not([hidden])').forEach((el, index) => el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, delay: 35 + index * 18, fill: 'backwards', easing: 'ease-out' }));
    $('.cc-wifi', panel).focus({ preventScroll: true });
  }
}
trigger.addEventListener('click', () => setOpen(!state.controlCenterOpen, true));
$('.cc-dismiss', panel).addEventListener('click', () => setOpen(false, true));
document.addEventListener('pointerdown', event => { if (state.controlCenterOpen && !panel.contains(event.target) && !host.contains(event.target)) setOpen(false); });
document.addEventListener('keydown', event => {
  if (!state.controlCenterOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
  if (event.key === 'Tab') {
    const controls = [...panel.querySelectorAll('button, input')].filter(el => !el.closest('[hidden]'));
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('resize', () => { if (state.controlCenterOpen) positionPanel(); });

// FLIP retains the module's surface and animates neighbouring controls into place.
function morph(change) {
  const modules = [...panel.querySelectorAll('.cc-grid > *')];
  const before = new Map(modules.map(el => [el, el.getBoundingClientRect()]));
  change();
  if (reducedMotion()) return;
  modules.forEach(el => {
    const a = before.get(el), b = el.getBoundingClientRect();
    if (!a.width || !b.width || !a.height || !b.height) return;
    el.getAnimations().forEach(animation => animation.cancel());
    el.animate(springFrames(p => ({ transform: `translate(${(a.left - b.left) * (1 - p)}px, ${(a.top - b.top) * (1 - p)}px) scale(${1 + (a.width / b.width - 1) * (1 - p)}, ${1 + (a.height / b.height - 1) * (1 - p)})` })), { duration: 600 });
  });
}
function expand(name) {
  const target = $(`[data-module="${name}"]`, panel);
  const open = !target.classList.contains('is-expanded');
  morph(() => {
    panel.querySelectorAll('[data-module]').forEach(el => {
      const expanded = el === target && open;
      el.classList.toggle('is-expanded', expanded);
      $('.cc-details', el).hidden = !expanded;
      el.querySelectorAll('[aria-expanded]').forEach(button => button.setAttribute('aria-expanded', String(expanded)));
    });
  });
  if (open && !reducedMotion()) $('.cc-details', target).animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, delay: 80, fill: 'backwards' });
}
$('.cc-network-expand', panel).onclick = () => expand('network');
$('.cc-edit-controls', panel).onclick = () => expand('display');
$('.cc-media-expand', panel).onclick = () => expand('media');
$('.cc-display .cc-slider-heading button', panel).onclick = () => expand('display');
panel.querySelectorAll('.cc-sound [aria-expanded]').forEach(el => el.onclick = () => expand('sound'));
function toggle(selector, key, update) {
  $(selector, panel).onclick = () => { state[key] = !state[key]; $(selector, panel).setAttribute('aria-pressed', String(state[key])); update?.(); };
}
function updateConnection() {
  $('.cc-wifi-status', panel).textContent = !state.wifiEnabled ? 'Off' : navigator.onLine ? 'Home' : 'Offline';
  $('.cc-connection-detail', panel).textContent = !state.wifiEnabled ? 'Demo disconnected' : navigator.onLine ? 'Online · Available for collaboration' : 'Offline · Desktop still available';
}
toggle('.cc-wifi', 'wifiEnabled', updateConnection);
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
toggle('.cc-bluetooth', 'bluetoothEnabled', () => { $('.cc-bluetooth-status', panel).textContent = state.bluetoothEnabled ? 'Discoverable' : 'Off'; });
toggle('.cc-airdrop', 'airdropEnabled', () => { $('.cc-airdrop-status', panel).textContent = state.airdropEnabled ? 'Everyone · Demo discovery' : 'Discovery off'; });
toggle('.cc-focus', 'focusEnabled', () => {
  document.body.classList.toggle('cc-focus-mode', state.focusEnabled);
  $('.cc-focus-status', panel).textContent = state.focusEnabled ? 'On' : 'Off';
  $('.cc-session-status', panel).textContent = state.focusEnabled ? 'A little room to concentrate.' : 'Your desktop, your flow.';
});
function updateStage() {
  const windows = [...document.querySelectorAll('.window, .calculator')].filter(el => getComputedStyle(el).display !== 'none');
  windows.sort((a, b) => (Number(getComputedStyle(b).zIndex) || 0) - (Number(getComputedStyle(a).zIndex) || 0));
  document.querySelectorAll('.cc-staged').forEach(el => el.classList.remove('cc-staged'));
  if (state.stageEnabled) windows.slice(1).forEach(el => el.classList.add('cc-staged'));
}
toggle('.cc-stage', 'stageEnabled', updateStage);
const stageObserver = new MutationObserver(() => { if (state.stageEnabled) updateStage(); });
document.querySelectorAll('.window, .calculator').forEach(el => stageObserver.observe(el, { attributes: true, attributeFilter: ['style'] }));
function previews(open) { morph(() => { $('.cc-previews', panel).hidden = !open; $('.cc-mirror', panel).setAttribute('aria-expanded', String(open)); }); }
$('.cc-mirror', panel).onclick = () => previews($('.cc-previews', panel).hidden);
$('.cc-preview-close', panel).onclick = () => { previews(false); $('.cc-mirror', panel).focus(); };
panel.querySelectorAll('[data-preview]').forEach(el => el.onclick = () => { $(el.dataset.preview)?.click(); setOpen(false); });
$('.cc-calculator', panel).onclick = () => { $('.open-cal').click(); setOpen(false); };
const selectAppearance = glassSwitcher($('.cc-display .cc-segmented', panel));
function applyAppearance(appearance) {
  state.appearance = appearance;
  document.body.classList.toggle('light-mode', appearance === 'light' || appearance === 'system' && systemAppearance.matches);
  localStorage.setItem('theme', appearance);
  $('#themeToggle .material-icons-round').textContent = document.body.classList.contains('light-mode') ? 'dark_mode' : 'light_mode';
  panel.querySelectorAll('[data-appearance]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.appearance === appearance)));
  selectAppearance(appearance);
  $('.cc-appearance', panel).title = `Appearance: ${appearance}`;
  $('.cc-appearance', panel).setAttribute('aria-label', `Appearance: ${appearance}. Change appearance`);
}
panel.querySelectorAll('[data-appearance]').forEach(el => el.onclick = () => applyAppearance(el.dataset.appearance));
$('.cc-appearance', panel).onclick = () => applyAppearance(document.body.classList.contains('light-mode') ? 'dark' : 'light');
$('#themeToggle').addEventListener('click', () => applyAppearance(document.body.classList.contains('light-mode') ? 'light' : 'dark'));
systemAppearance.addEventListener('change', () => { if (state.appearance === 'system') applyAppearance('system'); });
applyAppearance(state.appearance);
$('#bgToggle').onclick = () => {
  document.body.classList.toggle('static-mode');
  localStorage.setItem('bgMode', document.body.classList.contains('static-mode') ? 'static' : 'live');
  $('#bgToggle span').textContent = document.body.classList.contains('static-mode') ? 'Use live wallpaper' : 'Use static wallpaper';
};

function renderPlayback() {
  state.mediaPlaying = !audio.paused;
  const button = $('[data-media="play"]', panel);
  button.innerHTML = icon(state.mediaPlaying ? 'Pause' : 'Play');
  button.setAttribute('aria-label', state.mediaPlaying ? 'Pause ambience' : 'Play ambience');
  button.setAttribute('aria-pressed', String(state.mediaPlaying));
  $('.cc-artwork', panel).classList.toggle('is-playing', state.mediaPlaying);
}
async function play() {
  try { await audio.play(); $('.cc-media-status', panel).textContent = ''; }
  catch { $('.cc-media-status', panel).textContent = 'Playback unavailable. Please try again.'; expand('media'); }
  renderPlayback();
}
function changeTrack(delta) {
  const playing = !audio.paused;
  trackIndex = (trackIndex + delta + tracks.length) % tracks.length;
  audio.src = tracks[trackIndex].url;
  $('.cc-song', panel).textContent = tracks[trackIndex].title;
  $('.cc-artist', panel).textContent = tracks[trackIndex].subtitle;
  $('.cc-artwork span', panel).textContent = tracks[trackIndex].title.split(' ').map(word => word[0]).join('');
  $('.cc-artwork', panel).style.setProperty('--art-hue', `${trackIndex * 65}deg`);
  $('.cc-artwork', panel).classList.toggle('cc-demo-artwork', trackIndex !== 0);
  $('.cc-artwork span', panel).hidden = trackIndex === 0;
  if (playing) play();
  renderPlayback();
}
$('[data-media="play"]', panel).onclick = () => audio.paused ? play() : audio.pause();
$('[data-media="previous"]', panel).onclick = () => changeTrack(-1);
$('[data-media="next"]', panel).onclick = () => changeTrack(1);
audio.addEventListener('play', renderPlayback);
audio.addEventListener('pause', renderPlayback);
audio.addEventListener('ended', () => { changeTrack(1); play(); });
const timeText = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
audio.addEventListener('timeupdate', () => {
  $('.cc-elapsed', panel).textContent = timeText(audio.currentTime);
  if (Number.isFinite(audio.duration)) {
    $('.cc-duration', panel).textContent = timeText(audio.duration);
    const seek = $('#cc-seek');
    if (document.activeElement !== seek) { seek.value = audio.currentTime / audio.duration * 100; seek.parentElement.style.setProperty('--fill', `${seek.value}%`); seek.setAttribute('aria-valuetext', `${timeText(audio.currentTime)} of ${timeText(audio.duration)}`); }
  }
});
let unmutedVolume = 50;
$('.cc-mute', panel).onclick = () => {
  if (state.volume) { unmutedVolume = state.volume; $('#sound').value = 0; } else $('#sound').value = unmutedVolume;
  $('#sound').dispatchEvent(new Event('input'));
  $('.cc-mute span', panel).textContent = state.volume ? 'Mute ambience' : 'Unmute ambience';
};
const musicDock = $('.dock img[alt="Music Logo"]')?.closest('button');
musicDock?.addEventListener('click', () => { setOpen(true); if (!$('[data-module="media"]', panel).classList.contains('is-expanded')) expand('media'); });

// Small companion apps use the existing window layering and draggable infrastructure.
let companion, stream, timerInterval, timerDeadline = 0, timerRemaining = 300;
function closeCompanion() {
  stream?.getTracks().forEach(track => track.stop()); stream = null;
  companion?.remove(); companion = null;
}
function companionWindow(title) {
  closeCompanion(); setOpen(false);
  companion = document.createElement('section');
  companion.className = 'cc-app';
  companion.setAttribute('role', 'dialog');
  companion.setAttribute('aria-label', title);
  companion.innerHTML = `<header><button class="cc-app-close" aria-label="Close ${title}">${icon('X')}</button><strong>${title}</strong></header><div class="cc-app-content"></div>`;
  document.body.append(companion);
  liquidGlass(companion, { blur: '22px', tint: '28,34,48', opacity: '.8', depth: '0 20px 60px #00000040' });
  window.bringToFront?.(companion);
  $('.cc-app-close', companion).onclick = () => { closeCompanion(); trigger.focus(); };
  companion.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCompanion(); trigger.focus(); } });
  if (window.jQuery?.fn.draggable) window.jQuery(companion).draggable({ handle: 'header', containment: 'window' });
  $('.cc-app-close', companion).focus();
  return $('.cc-app-content', companion);
}
function renderTimer() {
  const remaining = timerDeadline ? Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000)) : timerRemaining;
  const display = $('#cc-timer-display');
  if (display) display.textContent = timeText(remaining);
  if (timerDeadline && remaining === 0) {
    timerDeadline = 0; timerRemaining = 0; clearInterval(timerInterval);
    if ($('#cc-timer-status')) $('#cc-timer-status').textContent = 'Session complete. Take a breath.';
    if ($('#cc-timer-start')) $('#cc-timer-start').textContent = 'Start';
    $('.cc-session-status', panel).textContent = 'Timer complete. Take a breath.';
    $('.cc-timer', panel).setAttribute('aria-label', 'Timer complete. Open Timer');
  }
}
$('.cc-timer', panel).onclick = () => {
  const content = companionWindow('Focus Timer');
  content.innerHTML = `<p>A moment for focused work.</p><output id="cc-timer-display">${timeText(timerRemaining)}</output><div class="cc-segmented"><button data-minutes="5">5 min</button><button data-minutes="15">15 min</button><button data-minutes="25">25 min</button></div><div class="cc-app-actions"><button id="cc-timer-start">${timerDeadline ? 'Pause' : 'Start'}</button><button id="cc-timer-reset">Reset</button></div><p id="cc-timer-status" role="status">${timerRemaining === 0 ? 'Session complete. Take a breath.' : 'Choose your pace.'}</p>`;
  content.querySelectorAll('[data-minutes]').forEach(el => el.onclick = () => { timerDeadline = 0; clearInterval(timerInterval); timerRemaining = Number(el.dataset.minutes) * 60; $('#cc-timer-start').textContent = 'Start'; $('#cc-timer-status').textContent = 'Ready when you are.'; renderTimer(); });
  $('#cc-timer-start').onclick = () => {
    if (timerDeadline) { timerRemaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000)); timerDeadline = 0; clearInterval(timerInterval); $('#cc-timer-start').textContent = 'Resume'; }
    else { if (!timerRemaining) timerRemaining = 300; timerDeadline = Date.now() + timerRemaining * 1000; clearInterval(timerInterval); timerInterval = setInterval(renderTimer, 250); $('#cc-timer-start').textContent = 'Pause'; $('#cc-timer-status').textContent = 'Your focus session is running.'; }
    renderTimer();
  };
  $('#cc-timer-reset').onclick = () => { timerDeadline = 0; timerRemaining = 300; clearInterval(timerInterval); $('#cc-timer-start').textContent = 'Start'; $('#cc-timer-status').textContent = 'Choose your pace.'; renderTimer(); };
  renderTimer();
};
$('.cc-camera', panel).onclick = () => {
  const content = companionWindow('Camera');
  content.innerHTML = `<div class="cc-camera-preview">${icon('Camera')}<video autoplay playsinline muted hidden></video><img alt="Your captured portrait" hidden></div><p id="cc-camera-status" role="status">A portrait, from your point of view.</p><div class="cc-app-actions"><button id="cc-camera-enable">Enable camera</button><button id="cc-camera-capture" disabled>Capture</button></div><a class="cc-photo-save" hidden download="portfolio-portrait.png">Save portrait</a>`;
  $('#cc-camera-enable').onclick = async () => {
    const session = companion;
    try {
      $('#cc-camera-status').textContent = 'Waiting for camera access…';
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (companion !== session) { cameraStream.getTracks().forEach(track => track.stop()); return; }
      stream = cameraStream;
      const video = $('video', content); video.srcObject = stream; video.hidden = false;
      await video.play();
      $('#cc-camera-capture').disabled = false;
      $('#cc-camera-enable').disabled = true;
      $('#cc-camera-status').textContent = 'Ready. Everything stays on your device.';
    } catch { if (companion === session) $('#cc-camera-status').textContent = 'Camera unavailable or access declined. You can try again.'; }
  };
  $('#cc-camera-capture').onclick = () => {
    const video = $('video', content);
    if (!video.videoWidth) return;
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const url = canvas.toDataURL('image/png');
    $('img', content).src = url; $('img', content).hidden = false;
    $('.cc-photo-save', content).href = url; $('.cc-photo-save', content).hidden = false;
    $('#cc-camera-status').textContent = 'Portrait captured. Save it below, or capture another.';
  };
};
updateConnection();
