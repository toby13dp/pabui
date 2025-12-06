const componentLibrary = [
  { type: "section", label: "Sectie", description: "Container met achtergrond", template: createSection },
  { type: "grid", label: "Grid", description: "Responsieve kolommen", template: createGrid },
  { type: "stack", label: "Stack", description: "Verticale stapel", template: createStack },
  { type: "hero", label: "Hero", description: "Titel, subtitel en CTA", template: createHero },
  { type: "navbar", label: "Navbar", description: "Logo en navigatie", template: createNavbar },
  { type: "card", label: "Kaart", description: "Titel, tekst en actie", template: createCard },
  { type: "media", label: "Media", description: "Afbeelding en copy", template: createMedia },
  { type: "stats", label: "Statistieken", description: "KPI rij", template: createStats },
  { type: "form", label: "Formulier", description: "Velden en submit", template: createForm },
  { type: "list", label: "Lijst", description: "Opsomming", template: createList },
  { type: "quote", label: "Quote", description: "Testimonial", template: createQuote },
  { type: "text", label: "Tekst", description: "Vrije tekst", template: createText },
  { type: "button", label: "Knop", description: "Call-to-action", template: createButton },
  { type: "image", label: "Afbeelding", description: "Plaatsaanduiding", template: createImage },
  { type: "divider", label: "Divider", description: "Scheiding", template: createDivider },
];

const history = {
  stack: [],
  pointer: -1,
  push(state) {
    this.stack = this.stack.slice(0, this.pointer + 1);
    this.stack.push(state);
    this.pointer = this.stack.length - 1;
  },
  undo() {
    if (this.pointer > 0) {
      this.pointer -= 1;
      return this.stack[this.pointer];
    }
    return null;
  },
  redo() {
    if (this.pointer < this.stack.length - 1) {
      this.pointer += 1;
      return this.stack[this.pointer];
    }
    return null;
  },
};

const selectors = {};

function init() {
  selectors.canvas = document.getElementById("canvas");
  selectors.componentGrid = document.getElementById("componentGrid");
  selectors.inspectorForm = document.getElementById("inspectorForm");
  selectors.contentInput = document.getElementById("contentInput");
  selectors.fontSizeInput = document.getElementById("fontSizeInput");
  selectors.bgInput = document.getElementById("bgInput");
  selectors.textColorInput = document.getElementById("textColorInput");
  selectors.paddingInput = document.getElementById("paddingInput");
  selectors.marginInput = document.getElementById("marginInput");
  selectors.widthInput = document.getElementById("widthInput");
  selectors.heightInput = document.getElementById("heightInput");
  selectors.gapInput = document.getElementById("gapInput");
  selectors.alignmentSelect = document.getElementById("alignmentSelect");
  selectors.textAlignSelect = document.getElementById("textAlignSelect");
  selectors.radiusInput = document.getElementById("radiusInput");
  selectors.borderInput = document.getElementById("borderInput");
  selectors.shadowSelect = document.getElementById("shadowSelect");
  selectors.snapToggle = document.getElementById("snapToggle");
  selectors.toggleGrid = document.getElementById("toggleGrid");
  selectors.exportModal = document.getElementById("exportModal");
  selectors.exportOutput = document.getElementById("exportOutput");
  selectors.selectionMeta = document.getElementById("selectionMeta");
  selectors.deleteButton = document.getElementById("delete");
  selectors.duplicateButton = document.getElementById("duplicate");

  renderPalette();
  registerCanvas();
  registerToolbar();
  registerInspector();
  addPlaceholder();
  addBaselineSection();
  captureSnapshot();
}

function renderPalette() {
  componentLibrary.forEach((component) => {
    const card = document.createElement("div");
    card.className = "component-card";
    card.draggable = true;
    card.dataset.type = component.type;
    card.innerHTML = `<strong>${component.label}</strong><span class="panel-caption">${component.description}</span>`;
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("component-type", component.type);
    });
    selectors.componentGrid.appendChild(card);
  });
}

function registerCanvas() {
  selectors.canvas.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  selectors.canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("component-type");
    if (!type) return;

    const element = createComponent(type);
    const target = event.target.closest(".droppable") || selectors.canvas;
    target.appendChild(element);
    removePlaceholder();
    captureSnapshot();
  });

  selectors.canvas.addEventListener("click", (event) => {
    const component = event.target.closest(".component");
    if (component) selectComponent(component);
  });
}

function registerToolbar() {
  document.getElementById("newPage").addEventListener("click", () => {
    selectors.canvas.innerHTML = "";
    addPlaceholder();
    addBaselineSection();
    captureSnapshot();
  });

  document.getElementById("undo").addEventListener("click", () => {
    const state = history.undo();
    if (state !== null) {
      selectors.canvas.innerHTML = state;
      rebindCanvas();
    }
  });

  document.getElementById("redo").addEventListener("click", () => {
    const state = history.redo();
    if (state !== null) {
      selectors.canvas.innerHTML = state;
      rebindCanvas();
    }
  });

  document.getElementById("save").addEventListener("click", () => {
    localStorage.setItem("pabui-layout", selectors.canvas.innerHTML);
    toast("Layout opgeslagen in localStorage");
  });

  document.getElementById("load").addEventListener("click", () => {
    const stored = localStorage.getItem("pabui-layout");
    if (!stored) return toast("Geen opgeslagen layout gevonden");
    selectors.canvas.innerHTML = stored;
    rebindCanvas();
    toast("Layout hersteld");
  });

  document.getElementById("exportHtml").addEventListener("click", exportHtml);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("copyHtml").addEventListener("click", copyHtml);
  document.getElementById("downloadHtml").addEventListener("click", downloadHtml);

  selectors.toggleGrid.addEventListener("click", () => {
    selectors.canvas.classList.toggle("grid-off");
    selectors.toggleGrid.textContent = selectors.canvas.classList.contains("grid-off")
      ? "Raster uit"
      : "Raster aan";
  });

  selectors.snapToggle.addEventListener("change", () => {
    selectors.canvas.classList.toggle("snap", selectors.snapToggle.checked);
  });
}

function registerInspector() {
  document.getElementById("applyStyles").addEventListener("click", applyStyles);

  selectors.deleteButton.addEventListener("click", () => {
    const selected = document.querySelector(".component.selected");
    if (!selected) return;
    const parent = selected.parentElement;
    selected.remove();
    selectors.selectionMeta.textContent = "Element verwijderd";
    if (!selectors.canvas.querySelector(".component")) addPlaceholder();
    if (parent?.classList.contains("component")) parent.classList.add("selected");
    captureSnapshot();
  });

  selectors.duplicateButton.addEventListener("click", () => {
    const selected = document.querySelector(".component.selected");
    if (!selected) return;
    const clone = selected.cloneNode(true);
    clone.classList.remove("selected");
    clone.removeAttribute("data-bound");
    clone.querySelectorAll("[data-bound]").forEach((node) => node.removeAttribute("data-bound"));
    attachHandlers(clone);
    selected.insertAdjacentElement("afterend", clone);
    captureSnapshot();
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTypingTarget =
      target instanceof HTMLElement &&
      (target.isContentEditable || target.closest("input, textarea, select, option, [contenteditable='true']"));

    if (isTypingTarget) return;

    if ((event.key === "Delete" || event.key === "Backspace") && document.querySelector(".component.selected")) {
      event.preventDefault();
      selectors.deleteButton.click();
    }
  });
}

function createComponent(type) {
  const libraryItem = componentLibrary.find((item) => item.type === type);
  if (!libraryItem) return document.createElement("div");
  const element = libraryItem.template();
  element.dataset.type = type;
  element.classList.add("component", type);
  applySnapSpacing(element);
  attachHandlers(element);
  return element;
}

function attachHandlers(element) {
  if (element.dataset.bound) return;
  element.dataset.bound = "true";
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    selectComponent(element);
  });
  if (element.classList.contains("droppable")) {
    element.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    element.addEventListener("drop", (event) => {
      event.preventDefault();
      const childType = event.dataTransfer.getData("component-type");
      if (!childType) return;
      const child = createComponent(childType);
      element.appendChild(child);
      captureSnapshot();
    });
  }
  element.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", (event) => event.preventDefault());
  });
  element.querySelectorAll(".component").forEach((child) => {
    if (child !== element) attachHandlers(child);
  });
}

function createSection() {
  const el = document.createElement("div");
  el.className = "section droppable";
  el.innerHTML = `<div class="panel-title">Sectie</div><div class="panel-caption">Drop componenten in deze sectie</div>`;
  return el;
}

function createGrid() {
  const el = document.createElement("div");
  el.className = "grid droppable";
  el.innerHTML = `<div class="panel-caption">Responsieve grid layout</div>`;
  return el;
}

function createStack() {
  const el = document.createElement("div");
  el.className = "stack droppable";
  el.innerHTML = `<div class="panel-caption">Verticale stapel</div>`;
  return el;
}

function createHero() {
  const el = document.createElement("div");
  el.className = "hero droppable";
  el.innerHTML = `
    <h1 class="content">Next-gen experiences</h1>
    <p class="content">Bouw digitale ervaringen met composable componenten en herbruikbare patronen.</p>
    <button class="component button" data-type="button">Start nu</button>
  `;
  return el;
}

function createNavbar() {
  const el = document.createElement("div");
  el.className = "navbar droppable";
  el.innerHTML = `
    <div class="brand-mark">PB</div>
    <nav class="nav-links">
      <a class="content" href="#">Product</a>
      <a class="content" href="#">Features</a>
      <a class="content" href="#">Pricing</a>
      <a class="content" href="#">Contact</a>
    </nav>
    <button class="component button" data-type="button">Start</button>
  `;
  return el;
}

function createCard() {
  const el = document.createElement("div");
  el.className = "card droppable";
  el.innerHTML = `
    <div class="eyebrow">Feature</div>
    <h3 class="content">Enterprise blok</h3>
    <p class="content">Combineer data, UI en workflows in herbruikbare blokken.</p>
    <button class="component button" data-type="button">Meer info</button>
  `;
  return el;
}

function createMedia() {
  const el = document.createElement("div");
  el.className = "media droppable";
  el.innerHTML = `
    <div class="media-visual component image" data-type="image">Media</div>
    <div class="media-copy">
      <div class="panel-caption">Use-case</div>
      <h3 class="content">Hybrid experiences</h3>
      <p class="content">Koppel content, componenten en automation in één flow.</p>
    </div>
  `;
  return el;
}

function createStats() {
  const el = document.createElement("div");
  el.className = "stats droppable";
  el.innerHTML = `
    <div class="stat">
      <div class="eyebrow">Adoptie</div>
      <div class="stat-value content">98%</div>
      <div class="panel-caption">Teamactivatie</div>
    </div>
    <div class="stat">
      <div class="eyebrow">Time-to-market</div>
      <div class="stat-value content">-64%</div>
      <div class="panel-caption">Door herbruikbare blokken</div>
    </div>
    <div class="stat">
      <div class="eyebrow">NPS</div>
      <div class="stat-value content">+22</div>
      <div class="panel-caption">Gebruikerservaring</div>
    </div>
  `;
  return el;
}

function createForm() {
  const el = document.createElement("div");
  el.className = "form droppable";
  el.innerHTML = `
    <label class="content">Naam<input class="component input" data-type="text" type="text" placeholder="Voornaam" /></label>
    <label class="content">E-mail<input class="component input" data-type="text" type="email" placeholder="werk@bedrijf.com" /></label>
    <label class="content">Bericht<textarea class="component input" data-type="text" rows="3" placeholder="Vertel meer"></textarea></label>
    <button class="component button" data-type="button">Verzend</button>
  `;
  return el;
}

function createList() {
  const el = document.createElement("ul");
  el.className = "list droppable";
  el.innerHTML = `
    <li class="content">Composable templates</li>
    <li class="content">Rol-afhankelijke ervaringen</li>
    <li class="content">Inline validatie en states</li>
  `;
  return el;
}

function createQuote() {
  const el = document.createElement("blockquote");
  el.className = "quote droppable";
  el.innerHTML = `
    <p class="content">“Met PabUI lanceren we nieuwe journeys in dagen, niet maanden.”</p>
    <footer class="panel-caption">Sanne, Director Digital</footer>
  `;
  return el;
}

function createText() {
  const el = document.createElement("div");
  el.className = "content";
  el.textContent = "Vrije tekst";
  return wrapLeaf(el, "text");
}

function createButton() {
  const el = document.createElement("button");
  el.className = "component button";
  el.textContent = "Actie";
  return el;
}

function createImage() {
  const el = document.createElement("div");
  el.textContent = "Afbeelding";
  return wrapLeaf(el, "image");
}

function createDivider() {
  const el = document.createElement("div");
  el.className = "divider";
  return el;
}

function wrapLeaf(element, type) {
  const wrapper = document.createElement("div");
  wrapper.appendChild(element);
  return wrapper;
}

function selectComponent(element) {
  document.querySelectorAll(".component.selected").forEach((node) => node.classList.remove("selected"));
  element.classList.add("selected");
  selectors.contentInput.value = element.textContent.trim();
  selectors.fontSizeInput.value = element.style.fontSize || getComputedStyle(element).fontSize;
  selectors.bgInput.value = rgbToHex(getComputedStyle(element).backgroundColor) || "#ffffff";
  selectors.textColorInput.value = rgbToHex(getComputedStyle(element).color) || "#1f2933";
  selectors.paddingInput.value = element.style.padding;
  selectors.marginInput.value = element.style.margin;
  selectors.widthInput.value = element.style.width;
  selectors.heightInput.value = element.style.height;
  selectors.gapInput.value = element.style.gap;
  selectors.textAlignSelect.value = element.style.textAlign || "";
  selectors.alignmentSelect.value = element.style.justifyContent || "";
  selectors.radiusInput.value = element.style.borderRadius;
  selectors.borderInput.value = element.style.border;
  selectors.shadowSelect.value = element.dataset.shadowPreset || "";
  updateSelectionMeta(element);
}

function applyStyles() {
  const selected = document.querySelector(".component.selected");
  if (!selected) return;

  const content = selectors.contentInput.value.trim();
  if (selectors.contentInput.value) {
    if (selected.dataset.type === "image" && /^https?:\/\//.test(content)) {
      selected.innerHTML = `<img src="${content}" alt="Afbeelding" />`;
    } else if (selected.dataset.type === "image") {
      selected.textContent = content || "Afbeelding";
    } else {
      selected.querySelectorAll(".content").forEach((node) => node.replaceChildren(document.createTextNode(content)));
      if (!selected.querySelector(".content")) {
        selected.textContent = content;
      }
    }
  }

  selected.style.background = selectors.bgInput.value || "";
  selected.style.color = selectors.textColorInput.value || "";
  selected.style.padding = selectors.paddingInput.value || "";
  selected.style.margin = selectors.marginInput.value || "";
  selected.style.width = selectors.widthInput.value || "";
  selected.style.height = selectors.heightInput.value || "";
  selected.style.fontSize = selectors.fontSizeInput.value || "";
  selected.style.gap = selectors.gapInput.value || "";
  selected.style.textAlign = selectors.textAlignSelect.value || "";
  selected.style.borderRadius = selectors.radiusInput.value || "";
  selected.style.border = selectors.borderInput.value || "";

  const alignment = selectors.alignmentSelect.value;
  if (alignment) {
    selected.style.display = "flex";
    selected.style.justifyContent = alignment;
  } else {
    selected.style.justifyContent = "";
  }

  applyShadow(selected, selectors.shadowSelect.value);
  updateSelectionMeta(selected);
  captureSnapshot();
}

function applyShadow(element, preset) {
  const presets = {
    soft: "0 12px 30px rgba(0,0,0,0.28)",
    strong: "0 18px 42px rgba(0,0,0,0.45)",
    glow: "0 0 0 1px rgba(59,130,246,0.4), 0 18px 36px rgba(34,211,238,0.28)",
  };
  element.style.boxShadow = presets[preset] || "";
  element.dataset.shadowPreset = preset || "";
}

function updateSelectionMeta(element) {
  if (!selectors.selectionMeta) return;
  if (!element) {
    selectors.selectionMeta.textContent = "Geen selectie";
    return;
  }
  const childCount = element.querySelectorAll(":scope > .component").length;
  const type = element.dataset.type || element.tagName.toLowerCase();
  selectors.selectionMeta.textContent = `${type} • ${childCount} subcomponenten`;
}

function addPlaceholder() {
  if (!selectors.canvas.querySelector(".placeholder")) {
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.textContent = "Sleep componenten hierheen";
    selectors.canvas.appendChild(placeholder);
  }
}

function removePlaceholder() {
  const placeholder = selectors.canvas.querySelector(".placeholder");
  if (placeholder) placeholder.remove();
}

function captureSnapshot() {
  history.push(selectors.canvas.innerHTML);
}

function applySnapSpacing(element) {
  if (selectors.snapToggle?.checked && !element.style.margin) {
    element.style.margin = "0 0 12px 0";
  }
  if (selectors.snapToggle?.checked && !element.style.padding) {
    element.style.padding = "16px";
  }
  if (selectors.snapToggle?.checked && !element.style.gap && (element.classList.contains("grid") || element.classList.contains("stack"))) {
    element.style.gap = "12px";
  }
}

function rebindCanvas() {
  selectors.canvas.querySelectorAll(".component").forEach((component) => {
    component.removeAttribute("data-bound");
    attachHandlers(component);
    applySnapSpacing(component);
  });
  addPlaceholder();
}

function exportHtml() {
  const html = selectors.canvas.innerHTML.trim();
  selectors.exportOutput.value = `<!DOCTYPE html>\n<html lang=\"nl\">\n  <head>\n    <meta charset=\"UTF-8\"/>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>\n    <title>Export</title>\n    <style>${inlineStyles()}</style>\n  </head>\n  <body>${html}</body>\n</html>`;
  selectors.exportModal.hidden = false;
}

function inlineStyles() {
  return `body { font-family: Inter, system-ui, -apple-system, sans-serif; background: #0b1224; color: #e2e8f0; padding: 32px; }
      .component { border: 1px solid #1f2a44; border-radius: 12px; padding: 16px; margin-bottom: 12px; background: rgba(255,255,255,0.03); }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
      .stack { display: flex; flex-direction: column; gap: 12px; }
      .navbar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 14px 18px; }
      .nav-links { display: flex; gap: 12px; justify-content: flex-start; }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); }
      .media { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; align-items: center; }
      .media-visual { min-height: 160px; display: grid; place-items: center; border: 1px dashed #1f2a44; }
      .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 14px; }
      .stat-value { font-size: 22px; font-weight: 800; }
      .form { display: grid; gap: 10px; }
      .list { list-style: disc; padding-left: 20px; }
      .quote { border-left: 4px solid #3b82f6; }
      .button { display: inline-flex; align-items: center; justify-content: center; border: none; background: linear-gradient(135deg,#3b82f6,#22d3ee); color:#0b1224; font-weight: 700; padding: 12px 20px; }
      .divider { height: 1px; background: #1f2a44; padding: 0; }
      .eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
      ul, p, h1, h2, h3 { margin: 0 0 10px; }`;
}

function closeModal() {
  selectors.exportModal.hidden = true;
}

function copyHtml() {
  navigator.clipboard.writeText(selectors.exportOutput.value);
  toast("HTML gekopieerd naar klembord");
}

function downloadHtml() {
  const blob = new Blob([selectors.exportOutput.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pabui-export.html";
  link.click();
  URL.revokeObjectURL(url);
}

function toast(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.position = "fixed";
  note.style.bottom = "16px";
  note.style.right = "16px";
  note.style.background = "rgba(34, 211, 238, 0.15)";
  note.style.border = "1px solid var(--accent)";
  note.style.padding = "10px 14px";
  note.style.borderRadius = "12px";
  note.style.color = "#e2e8f0";
  note.style.zIndex = 99;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 2200);
}

function addBaselineSection() {
  const section = createComponent("section");
  const navbar = createComponent("navbar");
  const hero = createComponent("hero");
  const stack = createComponent("stack");
  const text = createComponent("text");
  const stats = createComponent("stats");
  const card = createComponent("card");
  section.appendChild(hero);
  stack.appendChild(text);
  stack.appendChild(stats);
  stack.appendChild(card);
  section.appendChild(navbar);
  section.appendChild(stack);
  selectors.canvas.appendChild(section);
  removePlaceholder();
}

function rgbToHex(rgb) {
  if (!rgb) return "";
  const values = rgb.match(/\d+/g);
  if (!values || values.length < 3) return "";
  return `#${values
    .slice(0, 3)
    .map((v) => Number(v).toString(16).padStart(2, "0"))
    .join("")}`;
}

window.addEventListener("DOMContentLoaded", init);
