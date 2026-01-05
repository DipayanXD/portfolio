let globalZIndex = 100; // Track the highest layer

function bringToFront(element) {
  globalZIndex++;
  element.style.zIndex = globalZIndex;
}

/********** ELEMENTS **********/
const elements = {
  body: document.querySelector("body"),
  navbar: document.querySelector(".navbar"),
  open_spotlight: document.querySelector(".open_Search"),
  spotlight_search: document.querySelector(".spotlight_serach"),
  brightness_range: document.getElementById("brightness"),
  sound_range: document.getElementById("sound"),
  clockElement: document.getElementById("clock"),
  clockWrapper: document.querySelector(".clock"),
  widgetsPanel: document.querySelector(".widgets-panel"),
  batteryButton: document.querySelector(".battery"),
  batteryText: document.querySelector(".battery__text"),
  batteryPopup: document.querySelector(".battery__popup"),
  batteryPopupText: document.querySelector(".battery__popup header span"),
  batteryProgress: document.querySelector(".battery__progress"),
  batteryIsChargingLogo: document.querySelector(".is-charging"),
  powerSource: document.querySelector(".power-source"),
  themeToggle: document.getElementById("themeToggle"),
};

// Calculator App
const calculatorApp = {
  app_name: document.querySelector("#calculator"),
  window: document.querySelector(".calculator"),
  full: document.querySelector(".full"),
  close: document.querySelector(".close-cal"),
  backfull: document.querySelector(".min-cal"),
  point: document.querySelector("#point-cal"),
  opening: document.querySelector(".open-cal"),
  opening_l: document.querySelector(".open-cal-lunching"),
};

// Notes App
const notesApp = {
  app_name: document.querySelector("#Notes"),
  window: document.querySelector(".note"),
  full: document.querySelector(".full-note"),
  close: document.querySelector(".close-note"),
  backfull: document.querySelector(".backfull-note"),
  point: document.querySelector("#point-note"),
  adding: document.querySelector(".adding"),
  deleting: document.querySelector(".deleting"),
  content_typing: document.querySelector(".content__typing"),
  opening: document.querySelector(".open-note"),
  notes: document.querySelector(".content__sidebar--notes"),
};

// Terminal App
const terminalApp = {
  app_name: document.querySelector("#Terminal"),
  window: document.querySelector(".terminal"),
  full: document.querySelector(".full"),
  close: document.querySelector(".close"),
  backfull: document.querySelector(".backfull"),
  point: document.querySelector("#point-terminal"),
  content: document.querySelector(".terminal .terminal_content"),
  taskbar: document.querySelector(".terminal .window__taskbar"),
  opening: document.querySelector(".open-terminal"),
};

// VScode App

/*  Can't connect to the github.dev or vscode.dev 
const vscodeApp = {
  app_name: document.querySelector("#VScode"),
  window: document.querySelector(".Vscode"),
  close: document.querySelector(".close-Vscode"),
  backfull: document.querySelector(".backfull-Vscode"),
  full: document.querySelector(".full-Vscode"),
  point: document.querySelector("#point-vscode"),
  opening: document.querySelector(".open-vscode")
};
*/

// Maps App
const mapsApp = {
  app_name: document.querySelector("#map"),
  window: document.querySelector(".maps"),
  full: document.querySelector(".full-map"),
  close: document.querySelector(".close-map"),
  backfull: document.querySelector(".backfull-map"),
  point: document.querySelector("#point-maps"),
  opening: document.querySelector(".open-map"),
};

// --- Photos App (Achievements) Logic ---
const photosApp = {
  app_name: document.querySelector(".open-photos"), // Using the button itself as the trigger reference
  window: document.querySelector(".photos"),
  close: document.querySelector(".close-photos"),
  backfull: document.querySelector(".backfull-photos"),
  full: document.querySelector(".full-photos"),
  opening: document.querySelector(".open-photos")
};

// Event Listeners for Photos App
photosApp.opening.addEventListener("click", () => {
  // Logic to open window (using existing open_window function pattern)
  photosApp.window.style.display = "block";
  document.querySelector(".navbar").style.display = "flex";
  // Bring to front
  photosApp.window.style.zIndex = "100";
});

photosApp.close.addEventListener("click", () => {
  photosApp.window.style.display = "none";
});

photosApp.full.addEventListener("click", () => {
  handleFullScreen(photosApp.window);
});

photosApp.backfull.addEventListener("click", () => {
  handleMinimize(photosApp.window);
});

// Make it draggable (jQuery UI required, which is already in your project)
$(function () {
  $(".photos").draggable();
});



// Launchpad
const launchpad = {
  container: document.querySelector(".container__Window"),
  window: document.querySelector(".launchpad"),
  searchbox: document.querySelector(".launchpad .searchbox"),
  app_container: document.querySelector(".Apps-container"),
  point: document.querySelector("#point-launchpad"),
  opening: document.querySelector(".open-lunchpad"),
};

/********** LISTENERS **********/

/* 
Now it's not good cause when i set this, the default blur will be remove of everywhere.

function change_brightness() {
  var brightnessVal = elements.brightness_range.value;

  elements.body.style.filter = `brightness(${brightnessVal + '%'})`;
  elements.body.style.backdropFilter = `brightness(${brightnessVal + '%'})`;
}
*/

// Spotlight
function handleopen_spotlight() {
  if (elements.spotlight_search.style.display === "none") {
    elements.spotlight_search.style.display = "flex";
  } else {
    elements.spotlight_search.style.display = "none";
  }
}

// Notes app function start
function handleAdding() {
  const create_input = document.createElement("input");
  create_input.placeholder = "Writing name";
  notesApp.notes.appendChild(create_input);
}

function handleDeleting() {
  const inputChild = document.querySelector(".content__sidebar--notes input");
  inputChild.remove();
  notesApp.content_typing.style.display = "none";
}

function handleNotes() {
  notesApp.content_typing.style.display = "block";
}

// Notes app function end

function handleMinimize(Minimize) {
  Minimize.style.maxWidth = "80%";
  Minimize.style.minWidth = "70%";
  Minimize.style.height = "430px";
}

function handleFullScreen(maximize) {
  maximize.style.maxWidth = "95%";
  maximize.style.minWidth = "95%";
  maximize.style.height = "90%";
}

function close_window(close, point, appName) {
  close.style.display = "none";
  point.style.display = "none";
  appName.style.display = "none";
}

function open_window(open, point, appName) {
  elements.navbar.style.display = "flex";
  open.style.display = "block";
  launchpad.container.style.display = "flex";
  launchpad.window.style.display = "none";
  launchpad.point.style.display = "none";
  appName.style.display = "block";
  point.style.display = "block";
  bringToFront(open);
}

// Launchpad function start
launchpad.opening.addEventListener("click", handleOpenLaunching);

function handleOpenLaunching() {
  if (launchpad.window.style.display === "none") {
    launchpad.window.style.display = "block";
    elements.navbar.style.display = "none";
    launchpad.point.style.display = "block";
  } else {
    launchpad.window.style.display = "none";
    elements.navbar.style.display = "flex";
    launchpad.point.style.display = "none";
  }
  launchpad.container.style.display = "none";
}

function handleLaunchpadSearch(e) {
  for (let app of launchpad.app_container.children) {
    if (e.target.value) {
      app.style.display = "none";
      if (app.dataset.keywords.includes(e.target.value)) {
        app.style.display = "flex";
      }
    } else app.style.display = "flex";
  }
}
// Launchpad function end

// Calculator app start
function handleOpenCal_lunchpad() {
  calculatorApp.window.style.display = "block";
  calculatorApp.app_name.style.display = "block";
  launchpad.container.style.display = "flex";
  elements.navbar.style.display = "flex";
  launchpad.window.style.display = "none";
  calculatorApp.point.style.display = "block";
  launchpad.point.style.display = "none";
}
// Calculator app end

handleopen_spotlight();
handleOpenLaunching();
notesApp.adding.addEventListener("click", handleAdding);
calculatorApp.backfull.addEventListener("click", () =>
  handleMinimize(terminalApp.window)
);
notesApp.backfull.addEventListener("click", () =>
  handleMinimize(notesApp.window)
);
terminalApp.close.addEventListener("click", () =>
  close_window(terminalApp.window, terminalApp.point, terminalApp.app_name)
);
notesApp.close.addEventListener("click", () =>
  close_window(notesApp.window, notesApp.point, notesApp.app_name)
);
mapsApp.close.addEventListener("click", () =>
  close_window(mapsApp.window, mapsApp.point, mapsApp.app_name)
);
notesApp.deleting.addEventListener("click", handleDeleting);
terminalApp.full.addEventListener("click", () =>
  handleFullScreen(terminalApp.window)
);
notesApp.full.addEventListener("click", () =>
  handleFullScreen(notesApp.window)
);
/*
vscodeApp.full.addEventListener("click", () =>
  handleFullScreen(vscodeApp.window)
);
*/
mapsApp.full.addEventListener("click", () => handleFullScreen(mapsApp.window));
notesApp.window.addEventListener("click", handleNotes);
terminalApp.opening.addEventListener("click", () =>
  open_window(terminalApp.window, terminalApp.point, terminalApp.app_name)
);
notesApp.opening.addEventListener("click", () =>
  open_window(notesApp.window, notesApp.point, notesApp.app_name)
);
calculatorApp.opening.addEventListener("click", () =>
  open_window(calculatorApp.window, calculatorApp.point, calculatorApp.app_name)
);
/*
vscodeApp.opening.addEventListener("click", () =>
  open_window(vscodeApp.window, vscodeApp.point, vscodeApp.app_name)
);
*/
mapsApp.opening.addEventListener("click", () =>
  open_window(mapsApp.window, mapsApp.point, mapsApp.app_name)
);
/*
vscodeApp.close.addEventListener("click", () =>
  close_window(vscodeApp.window, vscodeApp.point, vscodeApp.app_name)
);
vscodeApp.backfull.addEventListener("click", () =>
  handleMinimize(vscodeApp.window)
);
*/
mapsApp.backfull.addEventListener("click", () =>
  handleMinimize(mapsApp.window)
);
calculatorApp.close.addEventListener("click", () =>
  close_window(
    calculatorApp.window,
    calculatorApp.point,
    calculatorApp.app_name
  )
);
document.querySelectorAll('.window, .calculator').forEach(win => {
  win.addEventListener('mousedown', () => bringToFront(win));
});
calculatorApp.opening_l.addEventListener("click", handleOpenCal_lunchpad);
elements.open_spotlight.addEventListener("click", handleopen_spotlight);
launchpad.searchbox.addEventListener("input", handleLaunchpadSearch);
elements.clockWrapper.addEventListener("click", () => {
  elements.widgetsPanel.classList.toggle("open");
});

// Calculator code
// select all the buttons
const calculatorButtons = document.querySelectorAll(".input button");
// select the <input type="text" class="display" disabled> element
const calculatorDisplay = document.querySelector(".display");

// add eventListener to each button
calculatorButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    calculate(event.target.value, calculatorDisplay);
    console.log("btn");
  });
});

function lastNumber(value) {
  return value.split(/[\+\-\*\/\%]/).pop();
}

const operators = ["+", "-", "*", "/", "%"];

function calculate(value, display) {
  const latestChar = display.value[display.value.length - 1];

  const isEmpty = display.value === "0";
  const isDecimalLastOperand = lastNumber(display.value).includes(".");
  const isNumber = /^[0-9]$/.test(value);

  if (isEmpty && isNumber) {
    return (display.value = value);
  }

  switch (value) {
    case "=":
      if (!isEmpty) display.value = eval(display.value);
      return;
    case ".":
      if (!isDecimalLastOperand) display.value += ".";
      return;
    case "C":
      return (display.value = "0");
    case "+/-":
      if (
        !operators.some((operator) =>
          display.value.replace(/^-/, "").includes(operator)
        )
      )
        display.value = -1 * parseFloat(display.value);
      return;
    case "*":
    case "/":
    case "-":
    case "+":
    case "%":
      if (operators.includes(latestChar)) {
        return (display.value = display.value.slice(0, -1) + value);
      }
    // Fall through to default case
    default:
      display.value += value;
  }
}

// App draggable
$(function () {
  $(".terminal").draggable();
  $(".note").draggable();
  $(".calculator").draggable();
  $(".Vscode").draggable();
  $(".spotlight_serach").draggable();
  $(".maps").draggable();
});

// Date and time
const dateElement = document.getElementById("date");
const currentDate = new Date();
dateElement.innerHTML = currentDate.toDateString();

function digi() {
  const date = new Date();
  let hour = date.getHours();
  let minute = checkTime(date.getMinutes());

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  if (hour > 12) {
    hour = hour - 12;
    if (hour === 12) {
      hour = checkTime(hour);
      elements.clockElement.innerHTML = hour + ":" + minute + " AM";
    } else {
      hour = checkTime(hour);
      elements.clockElement.innerHTML = hour + ":" + minute + " PM";
    }
  } else {
    elements.clockElement.innerHTML = hour + ":" + minute + " AM";
  }
}

let terminal_line_html = document.querySelector(".terminal_line").outerHTML;
let path = "~";
let dirName;
let dirs = ["Desktop", "Downloads", "Music", "Documents"];

function init_terminal_line() {
  $(".cursor").keydown(function (e) {
    if (e.keyCode === 13) {
      console.log("hello");
      e.preventDefault();
      let command = $(this).text().trim(); // Use .text() for contenteditable elements
      if (!command) return;

      let command_output = "zsh: command not found: " + command + "<br>";

      if (command.startsWith("cd ")) {
        path = command.substring(3);
        command_output = "";
      } else if (command === "ls") {
        command_output = dirs.join("\t");
      } else if (command === "pwd") {
        command_output = path + "/";
      } else if (command.startsWith("mkdir ")) {
        dirName = command.substring(6);
        dirs.push(dirName);
        command_output = "";
      } else if (command === "rmdir") {
        dirs.pop();
        command_output = "";
      } else if (command === "ps -aux") {
        command_output = "CPU = 56% <br> MEMORY = 25% <br> DISK = 34%";
      } else if (command.startsWith("cat ")) {
        command_output =
          "Lorem ipsum dolor sit amet consectetur adipisicing elit.<br> Fugiat nihil totam expedita sint necessitatibus quos ducimus.";
      } else if (command.startsWith("du -hs ")) {
        command_output = Math.floor(Math.random() * 100) + "GB";
      }

      $(this).removeAttr("contenteditable");
      $(this).removeClass("cursor");
      terminalApp.content.innerHTML += command_output; // Use .innerHTML to append string content
      let new_terminal_line_html = terminal_line_html.replace("~", path);
      terminalApp.content.innerHTML += new_terminal_line_html;
      placeCaretAtEnd(document.querySelector(".cursor"));
      init_terminal_line();
    }
  });
}

// init_terminal_line();
terminalApp.content.addEventListener("click", function () {
  placeCaretAtEnd(document.querySelector(".cursor"));
});

function placeCaretAtEnd(el) {
  el.focus();
  var range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// Right click to desktop
document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
  document.getElementById("contextMenu").style.opacity = "0";
}

function rightClick(e) {
  e.preventDefault();

  if (document.getElementById("contextMenu").style.opacity == "1") hideMenu();
  else {
    var menu = document.getElementById("contextMenu");

    menu.style.opacity = "1";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  }
}

// Loading
// const load = document.getElementById("loading");
// function lockload() {
//   load.style.display = "none";
// }

/********** Start Battery **********/
const calculateBattery = () => {
  let number = Math.floor(Math.random() * 100); // If there is any error, it will be the random default battery level
  let batteryIsCharging = false; // Charging status

  navigator
    .getBattery()
    .then(function (battery) {
      number = battery.level * 100;

      batteryIsCharging = battery.charging;
      battery.addEventListener("chargingchange", function () {
        batteryIsCharging = battery.charging;
      });
    })
    .finally(() => {
      elements.batteryText.textContent = `${number}%`;
      elements.batteryProgress.style.width = `${number}%`;
      elements.batteryPopupText.textContent = `${number}%`;

      if (number <= 20) {
        elements.batteryProgress.classList.add("battery__low");
      } else if ((number > 90 && batteryIsCharging) || batteryIsCharging) {
        elements.batteryProgress.classList.add("battery__high");
        elements.batteryIsChargingLogo.classList.add("is-charging-visibel");
        elements.powerSource.textContent = "Power Adapter";
      }
    });
};

elements.batteryButton.addEventListener("click", () => {
  elements.batteryPopup.classList.toggle("opened");
  elements.batteryButton.classList.toggle("selected");
});

// V1
// // --- TYPEWRITER EFFECT FOR TERMINAL ---
// const terminalContent = [
//   { text: "whoami", type: "command" },
//   { text: "Dipayan Das | BCA Student | Techno Main Salt Lake", type: "output" },
//   { text: "cat skills.txt", type: "command" },
//   { text: "C • Python • Git • Open Source Contributor", type: "output" },
//   { text: "./start_portfolio.sh", type: "command" },
//   { text: "Launching Dipayan's World...", type: "output", color: "#00ff00" }
// ];

// async function runTerminalSequence() {
//   const container = document.querySelector('.terminal_content');
//   container.innerHTML = `<p>Last Login: ${new Date().toDateString()} on admin_console</p>`; // Reset

//   for (let line of terminalContent) {
//     // Create line structure
//     const p = document.createElement('p');
//     if (line.type === 'command') {
//       p.innerHTML = `<span class="color_green">➜</span> <span class="color_blue">~</span> `;
//     }
//     container.appendChild(p);

//     // Type out text character by character
//     const textSpan = document.createElement('span');
//     if (line.color) textSpan.style.color = line.color;
//     p.appendChild(textSpan);

//     for (let char of line.text) {
//       textSpan.textContent += char;
//       await new Promise(r => setTimeout(r, 40)); // Typing speed (40ms)
//     }

//     // Add small delay between lines
//     await new Promise(r => setTimeout(r, 400));
//   }

//   // Add the blinking cursor at the end
//   const cursorLine = document.createElement('div');
//   cursorLine.className = 'terminal_line';
//   cursorLine.innerHTML = `<p><span class="color_green">➜</span> <span class="color_blue">~</span> <span contenteditable="true" class="cursor"></span></p>`;
//   container.appendChild(cursorLine);
// }

// // Trigger this when the page loads
// window.addEventListener('load', () => {
//   // Clear default static content first
//   setTimeout(runTerminalSequence, 1000); 
// });

// V2
// --- HACKER BIO CONFIGURATION ---
const bioLines = [
  { text: "whoami", type: "command" },
  { text: "Dipayan Das | BCA Student | Techno Main Salt Lake", type: "output" },
  { text: "cat contact_info.txt", type: "command" },
  { text: "📧 dipayan029@gmail.com | 🐙 github.com/DipayanXD", type: "output" },
  { text: "./init_portfolio.sh", type: "command" },
  { text: "Initializing System...", type: "output", color: "#00ff00" }
];

async function runHackerBio() {
  const container = document.getElementById('typing-area');

  // Update Date
  document.getElementById("currentDate").innerText = new Date().toDateString();

  for (let line of bioLines) {
    // 1. Create the line element
    const p = document.createElement('p');
    p.style.margin = "5px 0"; // Spacing

    // 2. Add Prompt if it's a command
    if (line.type === 'command') {
      p.innerHTML = `<span class="color_green">➜</span> <span class="color_blue">~</span> `;
    }

    // 3. Add the text span
    const textSpan = document.createElement('span');
    if (line.color) textSpan.style.color = line.color;
    if (line.type === 'output') textSpan.style.opacity = "0.9";
    p.appendChild(textSpan);
    container.appendChild(p);

    // 4. Typewriter Effect
    for (let char of line.text) {
      textSpan.textContent += char;
      // Scroll to bottom as we type
      const termWindow = document.querySelector('.terminal_content');
      termWindow.scrollTop = termWindow.scrollHeight;

      // Typing speed (randomized slightly for realism)
      await new Promise(r => setTimeout(r, Math.random() * 30 + 30));
    }

    // 5. Pause between lines
    await new Promise(r => setTimeout(r, 400));
  }

  // --- ANIMATION FINISHED: RESTORE INTERACTIVITY ---

  // Reveal the hidden 'real' input line from index.html
  const realInputLine = document.querySelector('.terminal_line');
  realInputLine.style.display = 'block';

  // Move it to the end of our typed content
  container.appendChild(realInputLine);

  // Focus the cursor
  const cursor = document.querySelector('.cursor');
  cursor.focus();

  // Initialize the original terminal logic so Enter key works
  init_terminal_line();
}

// Start the sequence when page loads
// --- TERMINAL ANIMATION FIX ---
let bioStarted = false; // Flag to ensure animation runs only once

terminalApp.opening.addEventListener("click", () => {
  open_window(terminalApp.window, terminalApp.point, terminalApp.app_name);
  // Only run animation if it hasn't started yet
  if (!bioStarted) {
    bioStarted = true;
    runHackerBio();
  }
});

/********** End Battery **********/

// Call the functions
calculateBattery();
digi();

/********** Theme Logic **********/
const handleThemeToggle = () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");

  // Persist
  localStorage.setItem("theme", isLight ? "light" : "dark");

  // Update Icon
  const icon = elements.themeToggle.querySelector(".material-icons-round");
  icon.textContent = isLight ? "dark_mode" : "light_mode";
};

// Initialize Theme
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    elements.themeToggle.querySelector(".material-icons-round").textContent = "dark_mode";
  }
};

elements.themeToggle.addEventListener("click", handleThemeToggle);

// --- Background Toggle Logic ---
const bgToggleButton = document.getElementById("bgToggle");
const handleBgToggle = () => {
  document.body.classList.toggle("static-mode");
  const isStatic = document.body.classList.contains("static-mode");
  localStorage.setItem("bgMode", isStatic ? "static" : "live");

  // Update button text/style
  if (bgToggleButton) {
    bgToggleButton.innerHTML = isStatic ?
      `<span class="material-icons-round" style="font-size: 18px;">image</span> Static BG` :
      `<span class="material-icons-round" style="font-size: 18px;">wallpaper</span> Live BG`;

    if (isStatic) bgToggleButton.classList.add('selected'); // Optional: make it look active
    else bgToggleButton.classList.remove('selected');
  }
};

const initBg = () => {
  const savedBg = localStorage.getItem("bgMode");
  if (savedBg === "static") {
    document.body.classList.add("static-mode");
    if (bgToggleButton) {
      bgToggleButton.innerHTML = `<span class="material-icons-round" style="font-size: 18px;">image</span> Static BG`;
      bgToggleButton.classList.add('selected');
    }
  }
};
if (bgToggleButton) bgToggleButton.addEventListener("click", handleBgToggle);
initBg();

// --- Mail App Logic ---
const mailApp = {
  app_name: document.querySelector(".open-mail"), // Using icon as trigger ref
  window: document.querySelector(".mail"),
  close: document.querySelector(".close-mail"),
  backfull: document.querySelector(".backfull-mail"),
  full: document.querySelector(".full-mail"),
  opening: document.querySelector(".open-mail")
};

// Event Listeners for Mail App
mailApp.opening.addEventListener("click", () => {
  mailApp.window.style.display = "block";
  document.querySelector(".navbar").style.display = "flex";
  // Bring to front
  bringToFront(mailApp.window);
});

mailApp.close.addEventListener("click", () => {
  mailApp.window.style.display = "none";
});

mailApp.full.addEventListener("click", () => {
  handleFullScreen(mailApp.window);
});

mailApp.backfull.addEventListener("click", () => {
  handleMinimize(mailApp.window);
});

// Make Mail App Draggable
$(function () {
  $(".mail").draggable();
});

// Ensure Mail App comes to front on mousedown
document.querySelector('.mail').addEventListener('mousedown', () => bringToFront(document.querySelector('.mail')));


// --- Mail Functional Logic ---
const mailLogic = {
  composeOverlay: null,
  composeBtn: null,
  closeBtn: null,
  sendBtn: null,
  toInput: null,
  subjectInput: null,
  bodyInput: null,

  init: function () {
    // Initialize elements here to ensure DOM is ready
    this.composeOverlay = document.querySelector('.mail-compose-overlay');
    this.composeBtn = document.querySelector('.material-icons-round[title="Compose"]');
    this.closeBtn = document.querySelector('.compose-close');
    this.sendBtn = document.getElementById('compose-send-btn');
    this.toInput = document.getElementById('compose-to'); // Note: This ID might not exist in HTML based on my previous read, checking.. wait, previous read showed recipient chip. Let me check resetForm. It says this.toInput.value = ''.
    // Actually, looking at the HTML, I don't see an input with ID 'compose-to'.
    // The recipient is a chip: <div class="recipient-chip">...</div>
    // But let's stick to adding the NEW fields first.

    this.senderNameInput = document.getElementById('compose-sender-name');
    this.senderEmailInput = document.getElementById('compose-sender-email');
    this.subjectInput = document.getElementById('compose-subject');
    this.bodyInput = document.getElementById('compose-body');

    if (!this.composeBtn || !this.composeOverlay) {
      console.error('Mail elements not found');
      return;
    }

    // Open Compose
    this.composeBtn.addEventListener('click', () => {
      this.composeOverlay.style.display = 'flex';
      // Focus on name first since it's the new required field at top (or arguably Name/Email)
      if (this.senderNameInput) this.senderNameInput.focus();
    });

    // Close Compose
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.composeOverlay.style.display = 'none';
      });
    }

    // Send Message
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSend());
    }
  },

  handleSend: function () {
    // const to = this.toInput.value; // "To" is currently hardcoded/visual only in the HTML provided (recipient chip)
    const senderName = this.senderNameInput.value;
    const senderEmail = this.senderEmailInput.value;
    const subject = this.subjectInput.value;
    const body = this.bodyInput.value;

    if (!senderName || !senderEmail || !subject || !body) {
      alert('Please fill in Name, Email, Subject, and Message.');
      return;
    }

    // GUI Feedback (FAB Animation)
    const iconInfo = this.sendBtn.querySelector('.material-icons-round');
    this.sendBtn.style.transform = 'scale(0.9)';
    this.sendBtn.style.transition = 'all 0.3s ease';

    // Spin animation
    iconInfo.style.animation = 'spin 1s linear infinite';
    iconInfo.innerText = 'sync';

    // Integrate with a real service here later. For now, simulate.
    setTimeout(() => {
      const cc = document.getElementById('compose-cc').value;
      this.saveToSent(senderName, senderEmail, subject, body, cc);

      // Success State
      iconInfo.style.animation = 'none';
      iconInfo.innerText = 'check';
      this.sendBtn.style.background = '#32d74b'; // Success Green
      this.sendBtn.style.transform = 'scale(1.1)';

      setTimeout(() => {
        this.composeOverlay.style.display = 'none';
        this.resetForm();

        // Reset Button
        iconInfo.innerText = 'arrow_upward';
        this.sendBtn.style.background = '#0a84ff';
        this.sendBtn.style.transform = 'scale(1)';

        // Play sent sound if valid (optional)
        // new Audio('assets/sounds/sent_mail.mp3').play().catch(e => console.log(e));
      }, 1000);

    }, 1500);
  },

  saveToSent: function (senderName, senderEmail, subject, body, cc) {
    const message = {
      id: Date.now(),
      senderName: senderName,
      senderEmail: senderEmail,
      to: "Dipayan Das", // Hardcoded for now based on UI
      cc: cc || '',
      subject: subject,
      body: body,
      date: new Date().toLocaleString()
    };

    const sentBox = JSON.parse(localStorage.getItem('sent-mail') || '[]');
    sentBox.unshift(message);
    localStorage.setItem('sent-mail', JSON.stringify(sentBox));

    console.log('Message saved to local storage:', message);
  },

  resetForm: function () {
    this.senderNameInput.value = '';
    this.senderEmailInput.value = '';
    document.getElementById('compose-cc').value = '';
    this.subjectInput.value = '';
    this.bodyInput.value = '';
  }
};

// Initialize Mail Logic
document.addEventListener('DOMContentLoaded', () => {
  // Wait for DOM to be fully ready ensuring elements exist
  setTimeout(() => mailLogic.init(), 100);
});

// Add spin animation for sending
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
