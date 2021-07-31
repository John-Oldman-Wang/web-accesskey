const timeMap = new WeakMap();

HTMLElement.prototype.onAltDown = function () {
  if (!this.shadowRoot) {
    this.attachShadow({ mode: "open" });
    const key = this.getAttribute("data-accesskey");
    this.shadowRoot.innerHTML = `<style>.key { }</style><slot></slot>(<span class="key">${key.toUpperCase()}</span>)`;
  }
  this.shadowRoot.querySelector(".key").style.textDecoration = "underline";
};

HTMLElement.prototype.onAltUp = function () {
  if (!this.shadowRoot) {
    return;
  }
  this.shadowRoot.querySelector(".key").style.textDecoration = "none";
};

class HandleAccessKey {
  handleUp(key, activeElement) {
    if (activeElement === document.body) {
      return;
    }
    if (!(activeElement instanceof Element)) {
      return;
    }
    const accessElement = activeElement.querySelector(
      `[data-accesskey=${key}]`
    );
    if (!accessElement) {
      return;
    }

    const event = document.createEvent("MouseEvent");
    event.initEvent("click", true, true);
    accessElement.dispatchEvent(event);
  }
  handleDown(key, activeElement) {
    if (activeElement === document.body) {
      return;
    }
    if (!(activeElement instanceof Element)) {
      return;
    }
    const accessElement = activeElement.querySelector(
      `[data-accesskey=${key}]`
    );
    if (!accessElement) {
      return;
    }
    console.log("accessElement", accessElement);
  }
  getAccessArea(activeElement) {
    if (
      !(activeElement instanceof Element) ||
      activeElement === document.body
    ) {
      return null;
    }
    const accessAreaElement = activeElement.closest(`[data-accessarea]`);
    return accessAreaElement;
  }
  handleAltDown(activeElement) {
    const accessAreaElement = this.getAccessArea(activeElement);
    if (!accessAreaElement) {
      return;
    }
    const accessElements =
      accessAreaElement.querySelectorAll("[data-accesskey]");
    accessElements.forEach((ele) => ele.onAltDown());
  }
  handleAltUp(activeElement) {
    const accessAreaElement = this.getAccessArea(activeElement);
    if (!accessAreaElement) {
      return;
    }
    const accessElements =
      accessAreaElement.querySelectorAll("[data-accesskey]");
    accessElements.forEach((ele) => ele.onAltUp());
  }
}

const handler = new HandleAccessKey();

window.addEventListener("blur", () => {
  handler.handleAltUp(document.activeElement);
});

document.addEventListener("keydown", (e) => {
  if (e.altKey && !e.ctrlKey && e.key === "Alt") {
    handler.handleAltDown(document.activeElement);
    e.preventDefault();
  }
  if (e.altKey && !e.ctrlKey && e.key.match(/^[a-z]{1}$/)) {
    handler.handleDown(e.key, document.activeElement);
  }
});

document.addEventListener("keyup", (e) => {
  if (!e.altKey && !e.ctrlKey && e.key === "Alt") {
    handler.handleAltUp(document.activeElement);
    e.preventDefault();
  }
  if (e.altKey && !e.ctrlKey && e.key.match(/^[a-z]{1}$/)) {
    handler.handleUp(e.key, document.activeElement);
  }
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-accesskey]");
  if (!btn) {
    return;
  }
  console.log(btn.innerText);
});
