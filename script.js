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

function start(target, name) {
  let bootFinished = true;
  let activated = false;

  function activate() {
    if (!bootFinished || activated) return;

    activated = true;
    let element = document.querySelector(`${target}`);
    if (element) {
      element.classList.add(name);
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
}

start(".search", "view");
start(".booting", "hide");
start(".intro", "show");

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("search");
  const panels = document.querySelectorAll("[data-category]");
  const intro = document.querySelector(".intro");
  let isShutdown = false; // Track shutdown state

  inputField.addEventListener("input", function () {
    // Prevent input if shutdown has been triggered
    if (isShutdown) {
      inputField.value = "";
      return;
    }

    const query = inputField.value.trim().toLowerCase();
    let matchFound = false; // Track if any match is found

    console.log(query);

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
      intro.style.display = "block"; // Show intro if input is empty
      return;
    }

    panels.forEach((panel) => {
      const categories = panel.dataset.category.split(" ");

      if (categories.includes(query)) {
        panel.style.display = "block";
        matchFound = true;
      }
    });

    // Only hide .intro if a match was found
    intro.style.display = matchFound ? "none" : "block";
  });
});

const randomNumber = Math.floor(Math.random() * 10001);
const visitorElement = document.querySelector(".visitor");
visitorElement.textContent = randomNumber;

function getRandomJobTitle() {
  const jobTitles = [
    "Software Engineer",
    "Product Manager",
    "UX Designer",
    "Data Scientist",
    "DevOps Engineer",
    "Marketing Specialist",
    "Cybersecurity Analyst",
    "AI Researcher",
    "Technical Writer",
    "Project Manager",
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
  const titleElement = document.querySelector(".designtitle");
  if (titleElement) {
    titleElement.addEventListener("click", insertJobTitle);
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

// Live age counter
function updateAge() {
  const birthdate = new Date("1997-07-06");
  const now = new Date();
  const unixTime = Math.floor(now.getTime() / 1000);

  const ageElement = document.querySelector(".age-counter");
  if (ageElement) {
    ageElement.textContent = `(${unixTime.toLocaleString()} years old)`;
  }
}

// Update age immediately and then every 100ms for smooth animation
updateAge();
setInterval(updateAge, 100);

/* Text appearing like LLM effect */
document.querySelectorAll(".ai").forEach((el) => {
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

      // Random gap between words: 30ms to 150ms, occasionally a longer pause
      let gap = 0.03 + Math.random() * 0.12;
      if (Math.random() < 0.1) gap += 0.15 + Math.random() * 0.2; // occasional pause
      cumulativeDelay += gap;
    }
  });

  setTimeout(() => {
    el.querySelectorAll(".word").forEach((span) => {
      span.style.animationPlayState = "running";
    });
  }, 3000);
});
