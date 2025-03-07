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
