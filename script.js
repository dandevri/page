/* https://github.com/conorbailey90/pixelated-menu/blob/main/app.js */
const pixelWrapper = document.querySelector(".pixelate");
let pixels = [];

function pixelate() {
  pixelWrapper.innerHTML = "";
  let size = window.innerWidth < 1200 ? 10 : window.innerWidth < 4000 ? 20 : 50;
  pixels = [];

  let pixelWidth = window.innerWidth / size;
  let height = window.innerHeight;

  for (let i = 0; i < size; i++) {
    let pixelColumn = document.createElement("div");
    pixelColumn.className = "pixel_column";
    pixelColumn.style.width = `${100 / size}vw`;
    pixelWrapper.appendChild(pixelColumn);
    for (let j = 0; j < height; j += pixelWidth) {
      let pixelDiv = document.createElement("div");
      pixelDiv.className = "pixel";
      pixelDiv.style.height = `${pixelWidth}px`;
      pixels.push(pixelDiv);
      pixelColumn.appendChild(pixelDiv);
    }
  }

  for (let i = 0; i < pixels.length; i++) {
    setTimeout(() => {
      let random = Math.floor(Math.random() * pixels.length);
      pixels[random].classList.add("active");
      pixels.splice(random, 1);
    }, i);

    if (i === pixels.length - 1) {
      setTimeout(() => {
        pixels = [...document.querySelectorAll(".pixel")];
      }, i + 10);
    }
  }
}

pixelate();

/* Loading baffles */
let headingTwos = baffle(document.querySelectorAll("h2"), {
  speed: 75,
});

headingTwos.reveal(500);

let headingThrees = baffle(document.querySelectorAll("h3"), {
  speed: 75,
});

headingThrees.reveal(500);

let background = baffle(document.querySelectorAll(".background"), {
  speed: 75,
});

background.reveal(500);

let number = baffle(document.querySelectorAll(".number"), {
  speed: 75,
});

number.reveal(2000);

/* Splash screen baffle */

let introOne = baffle(document.querySelector(".intro-one"), {
  speed: 25,
});

let introTwo = baffle(document.querySelector(".intro-two"), {
  speed: 25,
});

let introThree = baffle(document.querySelector(".intro-three"), {
  speed: 25,
});

let introFour = baffle(document.querySelector(".intro-four"), {
  speed: 25,
});

let introFive = baffle(document.querySelector(".intro-five"), {
  speed: 25,
});

introOne.reveal(1000, 500);
introTwo.reveal(1000, 1000);
introThree.reveal(1000, 1500);
introFour.reveal(1000, 2000);
introFive.reveal(1000, 2500);

let highlightOne = baffle(document.querySelector(".highlight-one"), {
  speed: 25,
});

highlightOne.reveal(1000, 4000);

let introSix = baffle(document.querySelector(".intro-six"), {
  speed: 25,
});

let introSeven = baffle(document.querySelector(".intro-seven"), {
  speed: 25,
});

let introEight = baffle(document.querySelector(".intro-eight"), {
  speed: 25,
});

let introNine = baffle(document.querySelector(".intro-nine"), {
  speed: 25,
});

introSix.reveal(1000, 5000);
introSeven.reveal(1000, 5250);
introEight.reveal(1000, 5500);
introNine.reveal(1000, 5750);

let highlightTwo = baffle(document.querySelector(".highlight-two"), {
  speed: 25,
});

highlightTwo.reveal(1000, 6500);

let logoOne = baffle(document.querySelector(".logo"), {
  speed: 25,
});

logoOne.reveal(500, 100);

let footerOne = baffle(
  document.querySelector("footer li:nth-of-type(1) span"),
  {
    speed: 25,
  }
);

let footerTwo = baffle(
  document.querySelector("footer li:nth-of-type(2) span"),
  {
    speed: 25,
  }
);

footerOne.reveal(250, 100);
footerTwo.reveal(250, 100);

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
const newTitle = "[vriOS disabled]";
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
  let bootFinished = false;
  let booting = document.querySelector("footer li:nth-of-type(1) span");

  setTimeout(function () {
    bootFinished = true;
  }, 0);

  function activate() {
    if (!bootFinished) return;

    let element = document.querySelector(`${target}`);
    if (element) {
      element.classList.add(name);
      booting.textContent = "[system status ok]";

      let footerThree = baffle(
        document.querySelector("footer li:nth-of-type(1) span"),
        {
          speed: 25,
        }
      );
      footerThree.reveal(250, 0);
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

start(".search", "show");
start(".booting", "hide");
start(".intro", "show");

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("search");
  const lists = document.querySelectorAll("ul[data-category]");
  const intro = document.querySelector(".intro");

  inputField.addEventListener("input", function () {
    const query = inputField.value.trim().toLowerCase();
    let matchFound = false; // Track if any match is found

    console.log(query);

    lists.forEach((ul) => {
      ul.style.display = "none"; // Hide all lists initially
    });

    if (query === "") {
      intro.style.display = "block"; // Show intro if input is empty
      return;
    }

    lists.forEach((ul) => {
      const categories = ul.dataset.category.split(" ");

      if (
        categories.includes(query) ||
        categories.includes(`-${query}`) ||
        categories.includes(`--${query}`)
      ) {
        ul.style.display = "block"; // Show the matching ul
        matchFound = true; // A match was found
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

document.addEventListener("DOMContentLoaded", () => {
  function updateWindowResolution() {
    const resolutionElement = document.querySelector(".resolution");
    resolutionElement.textContent = `${window.innerWidth} x ${window.innerHeight}`;
  }

  updateWindowResolution();
  window.addEventListener("resize", updateWindowResolution);
});

document.addEventListener("DOMContentLoaded", () => {
  function getNavigator() {
    const navigatorElement = document.querySelector(".navigator");
    navigatorElement.textContent = `${navigator.platform}`;
  }

  getNavigator();
});

function updateTime() {
  const currentTimeElement = document.querySelector(".currenttime");

  // Get the current time
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Format time as HH:MM:SS
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Display the time inside the currenttime element
  currentTimeElement.textContent = timeString;
}

// Call updateTime immediately to show the time instantly
updateTime();

// Set interval to update the time every second (1000ms)
setInterval(updateTime, 1000);
