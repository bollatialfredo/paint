const container = document.getElementById("paint-container");
const dialog = document.getElementById("dialog");
const colors = ["red", "blue", "yellow", "green", "brown"];
const DEBOUNCE_TIME = 1000;

let selectedColor = "black";
let isDrawing = false;
let eraseMode = false;
let resizeTimeOut;

function createGrid() {
  const cellSize = (window.innerWidth - 10) / 100;
  const cols = 100;
  const rows = Math.floor(window.innerHeight / cellSize) - 1;
  //console.log(cols, rows);
  container.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  container.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  container.innerHTML = "";
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    cell.addEventListener("mousedown", (e) => handleMouseDown(e, cell));
    cell.addEventListener("mouseover", (e) => handleMouseOver(e, cell));
    cell.addEventListener("dragstart", (e) => e.preventDefault());
    container.appendChild(cell);
  }
}

function handleMouseDown(e, cell) {
  if (e.button === 0) {
    eraseMode = cell.style.backgroundColor !== "";
    toggleCell(cell);
    isDrawing = true;
  } else if (e.button === 2) {
    showDialog(e);
  }
}

function handleMouseOver(e, cell) {
  if (isDrawing) {
    if (eraseMode) {
      cell.style.backgroundColor = "";
    } else {
      cell.style.backgroundColor = selectedColor;
    }
  }
}

function toggleCell(cell) {
  if (eraseMode) {
    cell.style.backgroundColor = "";
  } else {
    cell.style.backgroundColor = selectedColor;
  }
}

function showDialog(e) {
  e.preventDefault();
  dialog.innerHTML = "";
  dialog.style.left = `${e.pageX}px`;
  dialog.style.top = `${e.pageY}px`;
  dialog.style.display = "block";
  colors.forEach((color) => {
    const option = document.createElement("div");
    option.classList.add("color-option");
    option.style.backgroundColor = color;
    option.addEventListener("click", () => {
      selectedColor = color;
      dialog.style.display = "none";
    });
    dialog.appendChild(option);
  });
}

document.addEventListener("mouseup", () => (isDrawing = false));
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("mousemove", (e) => {
  if (!dialog.contains(e.target)) dialog.style.display = "none";
});

createGrid();

function handleResize (e) {
  clearTimeout(resizeTimeOut);
  resizeTimeOut = setTimeout(createGrid, DEBOUNCE_TIME);
};

window.addEventListener("resize", handleResize);
