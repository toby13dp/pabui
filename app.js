const componentLibrary = [
  { type: "section", label: "Sectie", description: "Container met achtergrond", template: createSection },
  { type: "row", label: "Row", description: "Bootstrap row", template: createRow },
  { type: "column", label: "Kolom", description: "Bootstrap column", template: createColumn },
  { type: "grid", label: "Grid", description: "Responsieve kolommen", template: createGrid },
  { type: "stack", label: "Stack", description: "Verticale stapel", template: createStack },
  { type: "hero", label: "Hero", description: "Titel, subtitel en CTA", template: createHero },
  { type: "navbar", label: "Navbar", description: "Logo en navigatie", template: createNavbar },
  { type: "card", label: "Kaart", description: "Titel, tekst en actie", template: createCard },
  { type: "media", label: "Media", description: "Afbeelding en copy", template: createMedia },
  { type: "tabs", label: "Tabs", description: "Nav-tabs en content", template: createTabs },
  { type: "accordion", label: "Accordion", description: "Inklapbare items", template: createAccordion },
  { type: "stats", label: "Statistieken", description: "KPI rij", template: createStats },
  { type: "form", label: "Formulier", description: "Velden en submit", template: createForm },
  { type: "list", label: "Lijst", description: "Opsomming", template: createList },
  { type: "quote", label: "Quote", description: "Testimonial", template: createQuote },
  { type: "text", label: "Tekst", description: "Vrije tekst", template: createText },
  { type: "video", label: "Video", description: "Embed of HTML5", template: createVideo },
  { type: "button", label: "Knop", description: "Call-to-action", template: createButton },
  { type: "image", label: "Afbeelding", description: "Plaatsaanduiding", template: createImage },
  { type: "divider", label: "Divider", description: "Scheiding", template: createDivider },
  { type: "spacer", label: "Spacer", description: "Lege ruimte", template: createSpacer },
  { type: "menu", label: "Menu", description: "Bootstrap navigatie", template: createMenu },
  { type: "breadcrumb", label: "Breadcrumbs", description: "Navigatiepad", template: createBreadcrumbs },
  { type: "loop", label: "Loop / JSON", description: "Render lijst uit data", template: createLoop },
];

const defaultSettings = {
  title: "PabUI-site",
  meta: "Composable site",
  favicon: "",
  colors: { primary: "#3b82f6", secondary: "#22d3ee", background: "#0b1224" },
  font: "Inter",
  container: "container",
  headScripts: "",
  bodyScripts: "",
};

let project = {
  settings: { ...defaultSettings },
  pages: { home: "" },
  popups: [],
  partials: [],
  revisions: {},
  currentPage: "home",
};

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
  selectors.gutterSelect = document.getElementById("gutterSelect");
  selectors.colXs = document.getElementById("colXs");
  selectors.colMd = document.getElementById("colMd");
  selectors.colLg = document.getElementById("colLg");
  selectors.alignmentSelect = document.getElementById("alignmentSelect");
  selectors.textAlignSelect = document.getElementById("textAlignSelect");
  selectors.radiusInput = document.getElementById("radiusInput");
  selectors.borderInput = document.getElementById("borderInput");
  selectors.shadowSelect = document.getElementById("shadowSelect");
  selectors.utilityInput = document.getElementById("utilityInput");
  selectors.visibilitySelect = document.getElementById("visibilitySelect");
  selectors.customClassInput = document.getElementById("customClassInput");
  selectors.dataSourceInput = document.getElementById("dataSourceInput");
  selectors.dataFieldsInput = document.getElementById("dataFieldsInput");
  selectors.cssSnippetInput = document.getElementById("cssSnippetInput");
  selectors.snapToggle = document.getElementById("snapToggle");
  selectors.toggleGrid = document.getElementById("toggleGrid");
  selectors.exportModal = document.getElementById("exportModal");
  selectors.exportOutput = document.getElementById("exportOutput");
  selectors.selectionMeta = document.getElementById("selectionMeta");
  selectors.deleteButton = document.getElementById("delete");
  selectors.duplicateButton = document.getElementById("duplicate");
  selectors.savePartial = document.getElementById("savePartial");

  selectors.pageSelect = document.getElementById("pageSelect");
  selectors.settingsModal = document.getElementById("settingsModal");
  selectors.siteSettings = document.getElementById("siteSettings");
  selectors.settingsForm = document.getElementById("settingsForm");
  selectors.popupModal = document.getElementById("popupModal");
  selectors.popupBuilder = document.getElementById("popupBuilder");
  selectors.partialGrid = document.getElementById("partialGrid");
  selectors.refreshPartials = document.getElementById("refreshPartials");
  selectors.partialModal = document.getElementById("partialModal");
  selectors.partialList = document.getElementById("partialList");
  selectors.partialManager = document.getElementById("partialManager");
  selectors.revisionModal = document.getElementById("revisionModal");
  selectors.revisionList = document.getElementById("revisionList");
  selectors.revisionCenter = document.getElementById("revisionCenter");

  loadProject();
  renderPalette();
  renderPartials();
  registerCanvas();
  registerToolbar();
  registerInspector();
  addPlaceholder();
  ensurePage();
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

function renderPartials() {
  if (!selectors.partialGrid) return;
  selectors.partialGrid.innerHTML = "";
  project.partials.forEach((partial, index) => {
    const card = document.createElement("div");
    card.className = "component-card partial-card";
    card.draggable = true;
    card.innerHTML = `<strong>${partial.name}</strong><span class="panel-caption">${new Date(partial.created).toLocaleString()}</span>`;
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("partial-index", String(index));
    });
    selectors.partialGrid.appendChild(card);
  });

  if (selectors.partialList) {
    selectors.partialList.innerHTML = project.partials
      .map(
        (p, idx) => `
          <div class="revision-row">
            <div>
              <div class="panel-title">${p.name}</div>
              <div class="panel-caption">${new Date(p.created).toLocaleString()}</div>
            </div>
            <div class="actions">
              <button data-partial="${idx}" class="ghost use-partial">Plaats</button>
              <button data-remove="${idx}" class="ghost danger">Verwijder</button>
            </div>
          </div>`
      )
      .join("");

    selectors.partialList.querySelectorAll(".use-partial").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const idx = Number(event.target.dataset.partial);
        const node = createPartialInstance(idx);
        if (node) selectors.canvas.appendChild(node);
        selectors.partialModal.setAttribute("hidden", true);
        captureSnapshot();
      });
    });

    selectors.partialList.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const idx = Number(event.target.dataset.remove);
        project.partials.splice(idx, 1);
        persistProject();
        renderPartials();
      });
    });
  }
}

function loadProject() {
  const stored = localStorage.getItem("pabui-project");
  if (stored) {
    project = { ...project, ...JSON.parse(stored) };
    project.revisions = project.revisions || {};
    project.partials = project.partials || [];
  }
  updatePageSelect();
  applySettingsToPage();
  document.getElementById("siteTitle").value = project.settings.title;
  document.getElementById("metaDescription").value = project.settings.meta;
  document.getElementById("faviconUrl").value = project.settings.favicon;
  document.getElementById("primaryColor").value = project.settings.colors.primary;
  document.getElementById("secondaryColor").value = project.settings.colors.secondary;
  document.getElementById("backgroundColor").value = project.settings.colors.background;
  document.getElementById("fontFamily").value = project.settings.font;
  document.getElementById("containerWidth").value = project.settings.container;
  document.getElementById("headScripts").value = project.settings.headScripts;
  document.getElementById("bodyScripts").value = project.settings.bodyScripts;
  renderPartials();
}

function updatePageSelect() {
  selectors.pageSelect.innerHTML = "";
  Object.keys(project.pages).forEach((page) => {
    const option = document.createElement("option");
    option.value = page;
    option.textContent = page;
    if (page === project.currentPage) option.selected = true;
    selectors.pageSelect.appendChild(option);
  });
}

function ensurePage() {
  if (!project.pages[project.currentPage]) {
    project.pages[project.currentPage] = "";
  }
  loadPage(project.currentPage);
}

function loadPage(name) {
  project.currentPage = name;
  selectors.pageSelect.value = name;
  const html = project.pages[name];
  selectors.canvas.innerHTML = html || "";
  if (!html) addBaselineSection();
  rebindCanvas();
  selectors.canvas.querySelectorAll(".popup-preview").forEach((n) => n.remove());
  project.popups.forEach(renderPopup);
  captureSnapshot();
}

function savePage() {
  project.pages[project.currentPage] = selectors.canvas.innerHTML;
  recordRevision(project.currentPage, selectors.canvas.innerHTML);
  persistProject();
}

function persistProject() {
  localStorage.setItem("pabui-project", JSON.stringify(project));
}

function registerCanvas() {
  selectors.canvas.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  selectors.canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("component-type");
    const partialIndex = event.dataTransfer.getData("partial-index");
    let element = null;
    if (partialIndex) {
      element = createPartialInstance(Number(partialIndex));
    } else if (type) {
      element = createComponent(type);
    }
    if (!element) return;

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
    const name = prompt("Naam van nieuwe pagina", `page-${Object.keys(project.pages).length + 1}`);
    if (!name) return;
    project.pages[name] = "";
    project.currentPage = name;
    updatePageSelect();
    loadPage(name);
    persistProject();
  });

  selectors.pageSelect.addEventListener("change", (event) => {
    savePage();
    loadPage(event.target.value);
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
    savePage();
    toast("Project opgeslagen");
  });

  document.getElementById("load").addEventListener("click", () => {
    loadProject();
    loadPage(project.currentPage);
    toast("Project hersteld");
  });

  document.getElementById("exportHtml").addEventListener("click", exportHtml);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("copyHtml").addEventListener("click", copyHtml);
  document.getElementById("downloadHtml").addEventListener("click", downloadHtml);

  selectors.siteSettings.addEventListener("click", () => selectors.settingsModal.toggleAttribute("hidden", false));
  document.getElementById("closeSettings").addEventListener("click", () => selectors.settingsModal.setAttribute("hidden", true));
  document.getElementById("saveSettings").addEventListener("click", saveSettings);

  selectors.popupBuilder.addEventListener("click", () => selectors.popupModal.toggleAttribute("hidden", false));
  document.getElementById("closePopup").addEventListener("click", () => selectors.popupModal.setAttribute("hidden", true));
  document.getElementById("injectPopup").addEventListener("click", injectPopup);

  selectors.partialManager.addEventListener("click", () => selectors.partialModal.toggleAttribute("hidden", false));
  document.getElementById("closePartialModal").addEventListener("click", () => selectors.partialModal.setAttribute("hidden", true));
  selectors.refreshPartials.addEventListener("click", renderPartials);

  selectors.revisionCenter.addEventListener("click", () => {
    renderRevisions();
    selectors.revisionModal.toggleAttribute("hidden", false);
  });
  document.getElementById("closeRevision").addEventListener("click", () => selectors.revisionModal.setAttribute("hidden", true));

  selectors.toggleGrid.addEventListener("click", () => {
    selectors.canvas.classList.toggle("grid-off");
    selectors.toggleGrid.textContent = selectors.canvas.classList.contains("grid-off")
      ? "Raster uit"
      : "Raster aan";
  });

  selectors.snapToggle.addEventListener("change", () => {
    selectors.canvas.classList.toggle("snap", selectors.snapToggle.checked);
  });

  document.querySelectorAll(".device-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".device-toggle button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectors.canvas.dataset.device = btn.dataset.device;
    });
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

  selectors.savePartial.addEventListener("click", () => {
    const selected = document.querySelector(".component.selected");
    if (!selected) return;
    const name = prompt("Naam van partial", `partial-${project.partials.length + 1}`);
    if (!name) return;
    const clone = selected.cloneNode(true);
    clone.classList.remove("selected");
    const html = clone.outerHTML;
    project.partials.push({ name, html, created: new Date().toISOString() });
    persistProject();
    renderPartials();
    toast("Partial opgeslagen");
  });

  document.addEventListener("keydown", (event) => {
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
      const partialIndex = event.dataTransfer.getData("partial-index");
      let child = null;
      if (partialIndex) {
        child = createPartialInstance(Number(partialIndex));
      } else if (childType) {
        child = createComponent(childType);
      }
      if (!child) return;
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

function createRow() {
  const el = document.createElement("div");
  el.className = "row droppable g-3";
  el.dataset.type = "row";
  return el;
}

function createColumn() {
  const el = document.createElement("div");
  el.className = "column droppable col-12";
  el.dataset.type = "column";
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

function createTabs() {
  const el = document.createElement("div");
  el.className = "tabs droppable";
  el.innerHTML = `
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-1" type="button" role="tab">Tab 1</button></li>
      <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-2" type="button" role="tab">Tab 2</button></li>
    </ul>
    <div class="tab-content p-3">
      <div class="tab-pane fade show active component content" id="tab-1" role="tabpanel">Tab inhoud 1</div>
      <div class="tab-pane fade component content" id="tab-2" role="tabpanel">Tab inhoud 2</div>
    </div>
  `;
  return el;
}

function createAccordion() {
  const el = document.createElement("div");
  el.className = "accordion droppable";
  el.innerHTML = `
    <div class="accordion-item component">
      <h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#item-1">Item 1</button></h2>
      <div id="item-1" class="accordion-collapse collapse show"><div class="accordion-body content">Content item 1</div></div>
    </div>
    <div class="accordion-item component">
      <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#item-2">Item 2</button></h2>
      <div id="item-2" class="accordion-collapse collapse"><div class="accordion-body content">Content item 2</div></div>
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

function createVideo() {
  const wrapper = document.createElement("div");
  wrapper.className = "video droppable";
  wrapper.innerHTML = `<div class="ratio ratio-16x9"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe></div>`;
  return wrapper;
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

function createSpacer() {
  const el = document.createElement("div");
  el.style.height = "48px";
  el.classList.add("spacer");
  el.textContent = "Spacer";
  return el;
}

function createMenu() {
  const el = document.createElement("nav");
  el.className = "navbar droppable";
  el.innerHTML = `
    <div class="brand-mark">LOGO</div>
    <div class="nav-links">
      <a href="#">Home</a>
      <a href="#">Features</a>
      <a href="#">Contact</a>
    </div>
    <button class="btn btn-primary">CTA</button>
  `;
  return el;
}

function createBreadcrumbs() {
  const el = document.createElement("nav");
  el.className = "breadcrumb-wrapper";
  el.innerHTML = `
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="#">Home</a></li>
      <li class="breadcrumb-item"><a href="#">Sectie</a></li>
      <li class="breadcrumb-item active">Pagina</li>
    </ol>`;
  return wrapLeaf(el, "breadcrumb");
}

function createLoop() {
  const el = document.createElement("div");
  el.className = "stack droppable loop";
  el.dataset.source = "";
  el.dataset.fields = "title=title;image=img;url=link";
  el.innerHTML = `
    <div class="eyebrow">Loop widget</div>
    <div class="content">Koppel een JSON bron in de inspector. Velden mapping: title, image, description, url.</div>
  `;
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
  selectors.gutterSelect.value = getBootstrapClass(element, /^g-/) || "";
  const colClasses = (element.className || "").split(" ").filter((c) => c.startsWith("col"));
  selectors.colXs.value = colClasses.find((c) => /^col(?!-sm|md|lg)/.test(c)) || "";
  selectors.colMd.value = colClasses.find((c) => c.startsWith("col-md")) || "";
  selectors.colLg.value = colClasses.find((c) => c.startsWith("col-lg")) || "";
  selectors.utilityInput.value = element.dataset.utilities || "";
  selectors.visibilitySelect.value = element.dataset.visibility || "";
  selectors.customClassInput.value = element.dataset.customClass || "";
  selectors.dataSourceInput.value = element.dataset.source || "";
  selectors.dataFieldsInput.value = element.dataset.fields || "";
  selectors.cssSnippetInput.value = element.dataset.cssSnippet || "";
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

  updateBootstrapClasses(selected);

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

function attachCssSnippet(css, key) {
  if (!css) return;
  const id = `snippet-${key}`;
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function updateBootstrapClasses(element) {
  if (selectors.gutterSelect.value && element.classList.contains("row")) {
    element.className = `${Array.from(element.classList)
      .filter((c) => !/^g-/.test(c))
      .join(" ")}`;
    element.classList.add(selectors.gutterSelect.value);
  }

  const colClasses = [selectors.colXs.value, selectors.colMd.value, selectors.colLg.value].filter(Boolean);
  if (element.classList.contains("column") || colClasses.length) {
    element.className = `${Array.from(element.classList)
      .filter((c) => !/^col/.test(c))
      .join(" ")} ${colClasses.join(" ")}`.trim();
  }

  if (selectors.utilityInput.value) {
    element.dataset.utilities = selectors.utilityInput.value;
    selectors.utilityInput.value
      .split(" ")
      .filter(Boolean)
      .forEach((cls) => element.classList.add(cls));
  }

  if (selectors.visibilitySelect.value) {
    element.dataset.visibility = selectors.visibilitySelect.value;
    selectors.visibilitySelect.value
      .split(" ")
      .filter(Boolean)
      .forEach((cls) => element.classList.add(cls));
  }

  if (selectors.customClassInput.value) {
    element.dataset.customClass = selectors.customClassInput.value;
    element.classList.add(...selectors.customClassInput.value.split(" ").filter(Boolean));
  }

  if (selectors.dataSourceInput.value) {
    element.dataset.source = selectors.dataSourceInput.value;
  }
  if (selectors.dataFieldsInput.value) {
    element.dataset.fields = selectors.dataFieldsInput.value;
  }
  if (selectors.cssSnippetInput.value) {
    element.dataset.cssSnippet = selectors.cssSnippetInput.value;
    attachCssSnippet(selectors.cssSnippetInput.value, element.dataset.id || element.dataset.type);
  }
}

function getBootstrapClass(element, regex) {
  const cls = (element.className || "").split(" ");
  return cls.find((c) => regex.test(c)) || "";
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

function applySettingsToPage() {
  document.title = project.settings.title;
  document.documentElement.style.setProperty("--primary", project.settings.colors.primary);
  document.documentElement.style.setProperty("--accent", project.settings.colors.secondary);
  document.body.style.background = project.settings.colors.background;
  document.body.style.fontFamily = project.settings.font;
  if (project.settings.headScripts) {
    selectors.settingsForm?.querySelector("#headScripts").value = project.settings.headScripts;
  }
  if (project.settings.bodyScripts) {
    selectors.settingsForm?.querySelector("#bodyScripts").value = project.settings.bodyScripts;
  }
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

function recordRevision(page, html) {
  if (!project.revisions[page]) project.revisions[page] = [];
  project.revisions[page].push({ html, ts: new Date().toISOString() });
  project.revisions[page] = project.revisions[page].slice(-15);
  persistProject();
}

function renderRevisions() {
  const list = project.revisions[project.currentPage] || [];
  selectors.revisionList.innerHTML = list
    .map(
      (rev, idx) => `
        <div class="revision-row">
          <div>
            <div class="panel-title">Snapshot ${idx + 1}</div>
            <div class="panel-caption">${new Date(rev.ts).toLocaleString()}</div>
          </div>
          <div class="actions">
            <button class="ghost" data-restore="${idx}">Herstel</button>
          </div>
        </div>`
    )
    .join("") || "<div class='note'>Nog geen revisies</div>";

  selectors.revisionList.querySelectorAll("[data-restore]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const idx = Number(event.target.dataset.restore);
      const rev = list[idx];
      if (!rev) return;
      selectors.canvas.innerHTML = rev.html;
      rebindCanvas();
      captureSnapshot();
      selectors.revisionModal.setAttribute("hidden", true);
    });
  });
}

function createPartialInstance(index) {
  const partial = project.partials[index];
  if (!partial) return null;
  const shell = document.createElement("div");
  shell.innerHTML = partial.html;
  const node = shell.firstElementChild;
  if (!node) return null;
  node.removeAttribute("data-bound");
  if (node.querySelectorAll) {
    node.querySelectorAll(".component").forEach((child) => child.removeAttribute("data-bound"));
  }
  attachHandlers(node);
  return node;
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
  selectors.exportOutput.value = `<!DOCTYPE html>\n<html lang=\"nl\">\n  <head>\n    <meta charset=\"UTF-8\"/>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>\n    <title>${project.settings.title}</title>\n    <meta name=\"description\" content=\"${project.settings.meta}\"/>\n    ${project.settings.favicon ? `<link rel=\"icon\" href=\"${project.settings.favicon}\"/>` : ""}\n    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\"/>\n    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css\"/>\n    <style>${inlineStyles()} ${collectCssSnippets()}</style>\n    ${project.settings.headScripts || ""}\n  </head>\n  <body class=\"${project.settings.container}\">${html}${renderPopupScripts()}</body>\n  ${project.settings.bodyScripts || ""}\n  <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>\n</html>`;
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
      .spacer { opacity: 0.6; border: 1px dashed #1f2a44; }
      .breadcrumb-wrapper { padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.04); }
      .loop { border: 1px dashed #22d3ee; background: rgba(34,211,238,0.05); }
      .list { list-style: disc; padding-left: 20px; }
      .quote { border-left: 4px solid #3b82f6; }
      .button { display: inline-flex; align-items: center; justify-content: center; border: none; background: linear-gradient(135deg,#3b82f6,#22d3ee); color:#0b1224; font-weight: 700; padding: 12px 20px; }
      .divider { height: 1px; background: #1f2a44; padding: 0; }
      .eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
      ul, p, h1, h2, h3 { margin: 0 0 10px; }`;
}

function collectCssSnippets() {
  const snippets = Array.from(document.querySelectorAll(".component"))
    .map((node) => node.dataset.cssSnippet)
    .filter(Boolean);
  return snippets.join(" ");
}

function renderPopupScripts() {
  if (!project.popups.length) return "";
  const payload = project.popups
    .map((p) => ({ ...p, content: p.content.replace(/`/g, "\\`") }))
    .map((p) =>
      JSON.stringify(p)
    )
    .join(",");
  return `<script>const popups=[${payload}];popups.forEach(cfg=>{const node=document.createElement('div');node.innerHTML=cfg.content;node.className='popup '+cfg.type;setTimeout(()=>{document.body.appendChild(node);if(cfg.trigger==='scroll'){const onScroll=()=>{if(window.scrollY>window.innerHeight*0.5){node.classList.add('visible');window.removeEventListener('scroll',onScroll);}};window.addEventListener('scroll',onScroll);}else{node.classList.add('visible');}},cfg.delay);});</script>`;
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

function saveSettings() {
  project.settings = {
    ...project.settings,
    title: document.getElementById("siteTitle").value || defaultSettings.title,
    meta: document.getElementById("metaDescription").value,
    favicon: document.getElementById("faviconUrl").value,
    colors: {
      primary: document.getElementById("primaryColor").value,
      secondary: document.getElementById("secondaryColor").value,
      background: document.getElementById("backgroundColor").value,
    },
    font: document.getElementById("fontFamily").value || defaultSettings.font,
    container: document.getElementById("containerWidth").value,
    headScripts: document.getElementById("headScripts").value,
    bodyScripts: document.getElementById("bodyScripts").value,
  };
  applySettingsToPage();
  persistProject();
  selectors.settingsModal.setAttribute("hidden", true);
  toast("Instellingen bewaard");
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

function injectPopup() {
  const popup = {
    type: document.getElementById("popupType").value,
    trigger: document.getElementById("popupTrigger").value,
    delay: Number(document.getElementById("popupDelay").value || 0),
    frequency: document.getElementById("popupFrequency").value || "once",
    content: document.getElementById("popupContent").value || "<p>Pop-up</p>",
  };
  project.popups.push(popup);
  persistProject();
  selectors.popupModal.setAttribute("hidden", true);
  renderPopup(popup);
  toast("Pop-up toegevoegd");
}

function renderPopup(config) {
  const wrapper = document.createElement("div");
  wrapper.className = `popup-preview ${config.type}`;
  wrapper.dataset.trigger = config.trigger;
  wrapper.dataset.delay = config.delay;
  wrapper.innerHTML = config.content;
  selectors.canvas.appendChild(wrapper);
  attachHandlers(wrapper);
  captureSnapshot();
}

function addBaselineSection() {
  const section = createComponent("section");
  const navbar = createComponent("navbar");
  const hero = createComponent("hero");
  const row = createComponent("row");
  const col1 = createComponent("column");
  const col2 = createComponent("column");
  col1.appendChild(createComponent("stats"));
  col2.appendChild(createComponent("card"));
  row.appendChild(col1);
  row.appendChild(col2);
  section.appendChild(navbar);
  section.appendChild(hero);
  section.appendChild(row);
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
