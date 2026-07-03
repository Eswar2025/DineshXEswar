const body = document.body;
const sidebarToggle = document.querySelector(".sidebar-toggle");
const profilePanel = document.querySelector(".profile-panel");
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const dots = document.querySelectorAll(".dot-rail button");
const arrowButtons = document.querySelectorAll("[data-direction]");
const projectName = document.querySelector(".project-name");
const projectType = document.querySelector(".project-type");
const progress = document.querySelector(".progress span");
const commandModal = document.querySelector(".command-modal");
const searchPill = document.querySelector(".search-pill");
const commandClose = document.querySelector(".command-input button");
const commandInput = document.querySelector(".command-input input");

const projects = [
  { name: "SHARPFLOW", type: "web app", progress: "35%" },
  { name: "STUDYSYNC", type: "study tracker", progress: "58%" },
  { name: "CODE LAB", type: "experiments", progress: "74%" },
  { name: "NOTES OS", type: "knowledge base", progress: "46%" },
];

let activeProject = 0;

function setProject(index) {
  activeProject = (index + projects.length) % projects.length;
  const project = projects[activeProject];
  projectName.textContent = project.name;
  projectType.textContent = project.type;
  progress.style.width = project.progress;
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeProject);
  });
}

function openCommand() {
  commandModal.hidden = false;
  requestAnimationFrame(() => commandInput.focus());
}

function closeCommand() {
  commandModal.hidden = true;
  commandInput.value = "";
}

sidebarToggle.addEventListener("click", () => {
  profilePanel.classList.toggle("is-hidden");
});

menuToggle.addEventListener("click", () => {
  const isHidden = menuPanel.classList.toggle("is-hidden");
  menuToggle.setAttribute("aria-expanded", String(!isHidden));
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.themeChoice;
    body.dataset.theme = theme;
    themeButtons.forEach((item) => item.classList.toggle("selected", item === button));
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => setProject(Number(dot.dataset.index)));
});

arrowButtons.forEach((button) => {
  button.addEventListener("click", () => setProject(activeProject + Number(button.dataset.direction)));
});

searchPill.addEventListener("click", openCommand);
commandClose.addEventListener("click", closeCommand);

commandModal.addEventListener("click", (event) => {
  if (event.target === commandModal) {
    closeCommand();
  }
});

document.addEventListener("keydown", (event) => {
  const isCommandKey = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
  if (isCommandKey) {
    event.preventDefault();
    openCommand();
  }

  if (event.key === "Escape" && !commandModal.hidden) {
    closeCommand();
  }

  if (event.key === "ArrowDown") {
    setProject(activeProject + 1);
  }

  if (event.key === "ArrowUp") {
    setProject(activeProject - 1);
  }
});

setProject(0);
