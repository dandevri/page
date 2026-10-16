/* https://github.com/conorbailey90/pixelated-menu/blob/main/app.js */
const pixelWrapper = document.querySelector(".pixelate");

function buildPixelGrid() {
  pixelWrapper.innerHTML = "";
  let size = window.innerWidth < 1200 ? 10 : window.innerWidth < 4000 ? 20 : 50;

  let pixelWidth = window.innerWidth / size;
  let height = window.innerHeight;
  let pixelCount = 0;

  for (let j = 0; j < height; j += pixelWidth) {
    pixelCount += 1;
  }

  const totalPixels = size * pixelCount;
  const order = Array.from({ length: totalPixels }, (_, index) => index).sort(
    () => Math.random() - 0.5,
  );
  let currentOrderIndex = 0;

  for (let i = 0; i < size; i++) {
    let pixelColumn = document.createElement("div");
    pixelColumn.className = "pixel_column";
    pixelColumn.style.width = `${100 / size}vw`;
    pixelWrapper.appendChild(pixelColumn);
    for (let j = 0; j < height; j += pixelWidth) {
      let pixelDiv = document.createElement("div");
      pixelDiv.className = "pixel";
      pixelDiv.style.height = `${pixelWidth}px`;
      pixelDiv.style.setProperty("--pixel-order", order[currentOrderIndex]);
      currentOrderIndex += 1;
      pixelColumn.appendChild(pixelDiv);
    }
  }
}

buildPixelGrid();

const now = new Date();

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dayOfWeek = days[now.getDay()];
const day = now.getDate();
const month = months[now.getMonth()];
const hours = now.getHours().toString().padStart(2, "0");
const minutes = now.getMinutes().toString().padStart(2, "0");
const seconds = now.getSeconds().toString().padStart(2, "0");

const formattedDate = `Last login: ${dayOfWeek} ${day} ${month} ${hours}:${minutes}:${seconds} [GMT+2]`;

document.querySelector(".step.two").textContent = formattedDate;

function changeFavicon(src) {
  // Remove any existing favicon
  const oldFavicon = document.querySelector("link[rel*='icon']");
  if (oldFavicon) {
    oldFavicon.parentNode.removeChild(oldFavicon);
  }

  // Create a new link element for the favicon
  const newFavicon = document.createElement("link");
  newFavicon.rel = "icon";
  newFavicon.type = "image/svg+xml";
  newFavicon.href = src;

  // Append the new favicon to the head
  document.getElementsByTagName("head")[0].appendChild(newFavicon);
}

// Function to change the favicon when tab is not focussed
const originalTitle = document.title;
const originalFavicon = "/static/favicon.svg";
const newTitle = "[ vriOS disabled ]";
const newFavicon = "/static/favicon_disabled.svg";

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.title = newTitle;
    changeFavicon(newFavicon);
  } else {
    document.title = originalTitle;
    changeFavicon(originalFavicon);
  }
});

// Silly placeholders shown in the assistant box while it's "thinking",
// before the actual message for the section starts typing out. Declared
// here (rather than near where it's used) so it's available before
// playIntroSequence can run - which happens synchronously below for
// returning visitors, ahead of the rest of the script.
const LOADING_WORDS = [
  "Wibbling Wrangling",
  "Unfurling Unravelling",
  "Swirling Swooping",
  "Seasoning Shenaniganing",
  "Processing Proofing",
  "Orbiting Osmosing",
  "Manifesting Meandering",
  "Imagining Improvising",
  "Hashing Hatching",
  "Garnishing Generating",
  "Fluttering Forming",
  "Doodling Drizzling",
  "Crunching Crystallizing",
  "Boogieing Boondoggling",
];

// Bumped every time the assistant box starts narrating a (possibly new)
// section, so a stale, already-pending timer (e.g. the boot sequence's)
// can tell it's no longer the current one and bail instead of clobbering
// whatever the assistant box is now showing.
let assistantGeneration = 0;

function start(target, name, onActivate) {
  let bootFinished = true;
  let activated = false;

  function activate() {
    if (!bootFinished || activated) return;

    activated = true;
    let element = document.querySelector(`${target}`);
    if (element) {
      element.classList.add(name);
    }
    if (typeof onActivate === "function") {
      onActivate();
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === " " && bootFinished) {
      event.preventDefault();
      activate();
    }
  });

  document.addEventListener("click", activate);
  document.addEventListener("touchstart", activate);

  return activate;
}

// Only show the boot sequence on a visitor's first load, or again once
// this timestamp is more than a day old.
const BOOT_STORAGE_KEY = "vriosLastBoot";
const BOOT_TTL_MS = 24 * 60 * 60 * 1000;

function hasRecentBoot() {
  const last = localStorage.getItem(BOOT_STORAGE_KEY);
  if (!last) return false;
  return Date.now() - Number(last) < BOOT_TTL_MS;
}

const activateSearch = start(".search", "view", () => {
  // clicking/tapping the boot screen to dismiss it can steal focus away
  // from the autofocused input, so restore it once the search bar shows
  const input = document.getElementById("search");
  if (input) {
    input.focus();
  }
});
const activateBooting = start(".booting", "hide", () => {
  localStorage.setItem(BOOT_STORAGE_KEY, Date.now().toString());
});
const activateIntro = start(".intro-shell", "show", playIntroSequence);
const activateSidebar = start(".sidebar", "view");

if (hasRecentBoot()) {
  activateSearch();
  activateBooting();
  activateIntro();
  activateSidebar();
}

// What the assistant box narrates while "generating" each section. Written
// like AndyAI is actually talking to you, in two sentences or so. The
// highlighted segment echoes the command that was just sent.
const SECTION_MESSAGES = {
  home: [
    "Alright, heading back to the ",
    { text: "[summary]", highlight: true },
    " page for you. Here's a recap of who Danny is and what you can ask me next.",
  ],
  biography: [
    "Sure thing, let me pull up the full ",
    { text: "[biography]", highlight: true },
    " on Danny de Vries for you. This one covers his entire career, education and a bit of his personal life too.",
  ],
  projects: [
    "Give me a second while I fetch the latest ",
    { text: "[projects]", highlight: true },
    " Danny has been working on. I'll show you what's active right now, plus what's sitting in the archive.",
  ],
  contact: [
    "Happy to help you get in touch, generating the best ways to ",
    { text: "[contact]", highlight: true },
    " Danny right now. He reads everything himself, so don't be shy.",
  ],
  uses: [
    "Let me put together the full list of things Danny ",
    { text: "[uses]", highlight: true },
    " — the hardware, software and tools he relies on daily. This gets updated every time something in his setup changes.",
  ],
  manifesto: [
    "One moment, compiling Danny's ",
    { text: "[manifesto]", highlight: true },
    " for you. It's the running list of principles that shape how he designs, builds and works.",
  ],
  attribution: [
    "Pulling up the ",
    { text: "[attribution]", highlight: true },
    " page now, crediting everyone whose work inspired this site. There's also a peek at the tech and philosophy behind it.",
  ],
  version: [
    "Fetching the system ",
    { text: "[version]", highlight: true },
    " info you asked for. Give me a moment to gather the specs and uptime details.",
  ],
  options: [
    "Opening up the ",
    { text: "[options]", highlight: true },
    " menu so you can tailor your experience. Feel free to switch up the theme, background or font to your liking.",
  ],
};

// How long a single word's own reveal animation takes (matches the
// `word-in` keyframes' duration in style.css).
const WORD_ANIMATION_MS = 200;

// Splits an array of text/highlight segments into paused per-word spans on
// `el`, the same word-in effect used for the assistant's initial greeting.
// Returns the delay (in seconds) of the last word, so callers can tell when
// the full message will have finished typing out.
function renderAssistantWords(el, segments) {
  el.textContent = "";
  let cumulativeDelay = 0;

  segments.forEach((segment) => {
    const isHighlight = typeof segment !== "string" && segment.highlight;
    const text = typeof segment === "string" ? segment : segment.text;

    text.split(/(\s+)/).forEach((part) => {
      if (part === "") return;
      if (/^\s+$/.test(part)) {
        el.appendChild(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "word";
      word.style.animationDelay = `${cumulativeDelay}s`;
      word.style.animationPlayState = "paused";

      if (isHighlight) {
        const mark = document.createElement("span");
        mark.className = "term-highlight";
        mark.textContent = part;
        word.appendChild(mark);
      } else {
        word.textContent = part;
      }

      el.appendChild(word);

      // Random gap between words: 15ms to 75ms, occasionally a longer pause
      let gap = 0.015 + Math.random() * 0.06;
      if (Math.random() < 0.1) gap += 0.075 + Math.random() * 0.1;
      cumulativeDelay += gap;
    });
  });

  return cumulativeDelay;
}

function playAssistantWords(el) {
  el.querySelectorAll(".word").forEach((span) => {
    span.style.animationPlayState = "running";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("search");
  const panels = Array.from(document.querySelectorAll("[data-category]"));
  const intro = document.querySelector(".intro");
  const introShell = document.querySelector(".intro-shell");
  const commandBar = document.querySelector(".command-bar");
  const assistantStatus = document.querySelector(".box.assistant .assistant-status");
  const assistantSpinner = document.querySelector(".box.assistant .spinner");
  const assistantLoading = document.querySelector(
    ".box.assistant .assistant-loading",
  );
  const assistantMessage = document.querySelector(
    ".box.assistant .intro-message",
  );
  const sidebar = document.querySelector(".sidebar");
  const sidebarTodos = Array.from(document.querySelectorAll(".sidebar-todo li"));
  let isShutdown = false; // Track shutdown state
  let revealTimeout = null;

  // Mirrors opencode's todo list: the section being viewed is "in
  // progress", and any section you've moved on from gets checked off.
  function markSidebarSection(key) {
    sidebarTodos.forEach((item) => {
      if (item.classList.contains("current") && item.dataset.section !== key) {
        item.classList.remove("current");
        item.querySelector(".todo-box").textContent = "[✓]";
      }
      if (item.dataset.section === key) {
        item.classList.add("current");
      }
    });
  }

  // The intro's summary/options block plays its scanline reveal once,
  // timed to the boot sequence. Freeze it in its finished state once done
  // so returning to the intro later doesn't replay that wait.
  const introGeneratedContent = document.querySelector(
    ".intro .generated-content",
  );
  if (introGeneratedContent) {
    introGeneratedContent.addEventListener("animationend", () => {
      introGeneratedContent.style.animation = "none";
      introGeneratedContent.style.clipPath = "none";
    });
  }

  function setCommandBarVisible(visible) {
    if (commandBar) {
      commandBar.classList.toggle("show", visible);
    }
  }

  // Runs the assistant box through its "thinking" spinner (with a silly
  // placeholder word), then types out a message naming the section being
  // generated, and only reveals that section once the typing has finished.
  function generateSection(key, revealContent) {
    assistantGeneration += 1;
    const myGeneration = assistantGeneration;

    if (assistantStatus) {
      assistantStatus.classList.add("active");
    }
    if (assistantSpinner) {
      assistantSpinner.classList.remove("done");
    }
    if (assistantLoading) {
      assistantLoading.textContent =
        LOADING_WORDS[Math.floor(Math.random() * LOADING_WORDS.length)] +
        "...";
    }
    if (assistantMessage) {
      assistantMessage.textContent = "";
    }

    revealTimeout = setTimeout(() => {
      if (assistantGeneration !== myGeneration) return;

      if (assistantSpinner) {
        assistantSpinner.classList.add("done");
        setTimeout(() => {
          if (assistantGeneration !== myGeneration) return;
          if (assistantStatus) assistantStatus.classList.remove("active");
        }, 250);
      }
      if (assistantLoading) {
        assistantLoading.textContent = "";
      }

      const segments = SECTION_MESSAGES[key];
      let typingSeconds = 0;
      if (segments && assistantMessage) {
        typingSeconds = renderAssistantWords(assistantMessage, segments);
        requestAnimationFrame(() => {
          if (assistantGeneration === myGeneration) playAssistantWords(assistantMessage);
        });
      }

      revealTimeout = setTimeout(() => {
        if (assistantGeneration !== myGeneration) return;
        revealContent();
      }, typingSeconds * 1000 + WORD_ANIMATION_MS);
    }, 900);
  }

  // Returning to the homepage after visiting another section should feel
  // the same as generating any other section. The very first appearance of
  // the intro (during boot) keeps its own slower, choreographed reveal, tied
  // to a fixed 7.7s delay - if the animation hasn't naturally finished (and
  // its animationend listener frozen it) by the time we get here, force it
  // into its final state so the summary never waits out that stale delay.
  function showHome() {
    setCommandBarVisible(false);
    markSidebarSection("home");
    generateSection("home", () => {
      if (introGeneratedContent) {
        introGeneratedContent.style.animation = "none";
        introGeneratedContent.style.clipPath = "none";
      }
      intro.classList.add("reveal-panel");
      intro.style.display = "block";
    });
  }

  // Reads whatever is currently in the input, "sends" it, then clears the
  // prompt - triggered by hitting Enter.
  function submitCommand() {
    if (isShutdown) {
      inputField.value = "";
      return;
    }

    const query = inputField.value.trim().toLowerCase();
    inputField.value = "";

    clearTimeout(revealTimeout);

    // Check for quit commands
    if (
      query === "q" ||
      query === "-q" ||
      query === "quit" ||
      query === "--quit"
    ) {
      isShutdown = true;

      // Hide all panels
      panels.forEach((panel) => {
        panel.style.display = "none";
      });
      intro.style.display = "none";
      introShell.style.display = "none";
      setCommandBarVisible(false);
      if (sidebar) sidebar.classList.remove("view");

      // Show shutdown screen
      const shutdownScreen = document.querySelector(
        '[data-category="-q q quit --quit"]',
      );
      if (shutdownScreen) {
        shutdownScreen.style.display = "block";
      }

      // Disable the input field
      inputField.disabled = true;
      inputField.placeholder = "[System shutdown - refresh to reboot]";

      return;
    }

    panels.forEach((panel) => {
      panel.style.display = "none"; // Hide all panels initially
    });

    if (query === "") {
      showHome(); // Show intro if input is empty
      return;
    }

    intro.style.display = "none";

    const matchedPanel = panels.find((panel) =>
      panel.dataset.category.split(" ").includes(query),
    );

    if (!matchedPanel) {
      showHome(); // No match, fall back to intro
      return;
    }

    setCommandBarVisible(true);
    markSidebarSection(matchedPanel.dataset.assistantKey);
    generateSection(matchedPanel.dataset.assistantKey, () => {
      matchedPanel.style.display = "block";
    });
  }

  inputField.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitCommand();
  });
});

const randomNumber = Math.floor(Math.random() * 10001);
const visitorElement = document.querySelector(".visitor");
visitorElement.textContent = randomNumber;
const sidebarVisitor = document.querySelector(".sidebar-visitor");
if (sidebarVisitor) {
  sidebarVisitor.textContent = randomNumber;
}

function getRandomJobTitle() {
  const jobTitles = [
    "Software Engineer",
    "Product Designer",
    "UX Designer",
    "Data Scientist",
    "AI Researcher",
    "Design Engineer",
    "Experience Designer",
    "Creative Technologist",
    "Creative Engineer"
  ];
  return jobTitles[Math.floor(Math.random() * jobTitles.length)];
}

function insertJobTitle() {
  const titleElement = document.querySelector(".designtitle");
  if (titleElement) {
    titleElement.textContent = getRandomJobTitle();
  } else {
    console.error("Element with class 'designtitle' not found.");
  }
}

// Add event listener to update job title on click
document.addEventListener("DOMContentLoaded", () => {
  const toggleElement = document.querySelector(".designtitle-toggle");
  if (toggleElement) {
    toggleElement.addEventListener("click", insertJobTitle);
    insertJobTitle(); // Set initial job title
  }
});

// Fetch latest commit hash from Codeberg
async function updateCommitVersion() {
  try {
    const response = await fetch(
      "https://codeberg.org/api/v1/repos/dandevri/page/commits?limit=1",
    );
    const commits = await response.json();

    if (commits && commits.length > 0) {
      const shortHash = commits[0].sha.substring(0, 7);
      const versionElements = document.querySelectorAll(".commit-version");

      versionElements.forEach((element) => {
        element.textContent = "#" + shortHash;
      });

      // Calculate uptime since last commit
      const commitDate = new Date(commits[0].commit.committer.date);
      const now = new Date();
      const diffMs = now - commitDate;

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      let uptimeText = "";
      if (days > 0) {
        uptimeText = `${days} day${days !== 1 ? "s" : ""}, ${hours}:${minutes.toString().padStart(2, "0")}`;
      } else if (hours > 0) {
        uptimeText = `${hours}:${minutes.toString().padStart(2, "0")}`;
      } else {
        uptimeText = `${minutes} min`;
      }

      const uptimeElement = document.querySelector(".commit-uptime");
      if (uptimeElement) {
        uptimeElement.textContent = uptimeText;
      }
    }
  } catch (error) {
    console.error("Failed to fetch commit hash:", error);
    // Keep default version if fetch fails
  }
}

updateCommitVersion();

// Live "time since epoch" counter (epoch = birthdate)
function updateAge() {
  const epoch = new Date("1997-06-07T00:00:00");
  const now = new Date();
  let diff = Math.floor((now.getTime() - epoch.getTime()) / 1000);

  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  diff -= minutes * 60;
  const seconds = diff;

  const pad = (num, len) => String(num).padStart(len, "0");

  const ageElement = document.querySelector(".age-counter");
  if (ageElement) {
    ageElement.textContent = `(${pad(days, 5)}d:${pad(
      hours,
      2
    )}h:${pad(minutes, 2)}m:${pad(seconds, 2)}s since epoch)`;
  }
}

// Update age immediately and then every second
updateAge();
setInterval(updateAge, 1000);

/* Text appearing like LLM effect */
const aiElements = document.querySelectorAll(".ai");

aiElements.forEach((el) => {
  const text = el.textContent;
  el.textContent = "";

  let cumulativeDelay = 0;

  text.split(/(\s+)/).forEach((part) => {
    if (part.trim() === "") {
      el.appendChild(document.createTextNode(part));
    } else {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = part;
      span.style.animationDelay = `${cumulativeDelay}s`;
      span.style.animationPlayState = "paused";
      el.appendChild(span);

      // Random gap between words: 15ms to 75ms, occasionally a longer pause
      let gap = 0.015 + Math.random() * 0.06;
      if (Math.random() < 0.1) gap += 0.075 + Math.random() * 0.1; // occasional pause
      cumulativeDelay += gap;
    }
  });
});

// Runs once the .intro section is revealed: shows a short "thinking"
// placeholder in the assistant box, then swaps it for the AI reply
// which generates in word-by-word.
function playIntroSequence() {
  const myGeneration = assistantGeneration;
  const introStatus = document.querySelector(".box.assistant .assistant-status");
  const introSpinner = document.querySelector(".box.assistant .spinner");
  const introLoading = document.querySelector(".box.assistant .assistant-loading");

  if (introStatus) {
    introStatus.classList.add("active");
  }
  if (introLoading) {
    introLoading.textContent =
      LOADING_WORDS[Math.floor(Math.random() * LOADING_WORDS.length)] + "...";
  }

  setTimeout(() => {
    // If the user has already navigated to a section, the assistant box is
    // busy narrating that instead - don't clobber it with the stale greeting.
    if (assistantGeneration !== myGeneration) return;

    if (introSpinner) {
      introSpinner.classList.add("done");
      // fully collapse the placeholder once its fade-out finishes
      setTimeout(() => {
        if (assistantGeneration !== myGeneration) return;
        if (introStatus) introStatus.classList.remove("active");
      }, 250);
    }
    if (introLoading) {
      introLoading.textContent = "";
    }

    aiElements.forEach((el) => {
      el.querySelectorAll(".word").forEach((span) => {
        span.style.animationPlayState = "running";
      });
    });
  }, 2000);
}

/* Options screen: radio-style selectable rows with a hover/focus preview */
document.querySelectorAll(".options").forEach((group) => {
  const buttons = Array.from(group.querySelectorAll(".option"));

  function select(target) {
    buttons.forEach((button) => {
      const checked = button === target;
      button.classList.toggle("active", checked);
      button.setAttribute("aria-checked", checked ? "true" : "false");
      button.querySelector(".option-check").textContent = checked
        ? "[*]"
        : "[ ]";
    });
  }

  buttons.forEach((button) => {
    const check = button.querySelector(".option-check");

    button.addEventListener("click", () => select(button));

    button.addEventListener("mouseenter", () => {
      if (!button.classList.contains("active")) check.textContent = "[*]";
    });
    button.addEventListener("mouseleave", () => {
      if (!button.classList.contains("active")) check.textContent = "[ ]";
    });
    button.addEventListener("focus", () => {
      if (!button.classList.contains("active")) check.textContent = "[*]";
    });
    button.addEventListener("blur", () => {
      if (!button.classList.contains("active")) check.textContent = "[ ]";
    });
  });
});
