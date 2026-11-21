// Wrapper for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });

  qs(selector).addEventListener("click", callback);
}

// Get a parameter from the URL query string
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Render a list of items into a parent element
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render a single HTML template
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

// Load an HTML template
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();

  return template;
}

// Load the shared header and footer
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// Display an alert message
export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");

  if (!main) return;

  const existingAlert = document.querySelector(".alert");

  if (existingAlert) {
    existingAlert.remove();
  }

  let messageText = message;

  if (typeof message !== "string") {
    messageText =
      message?.message ||
      message?.Message ||
      message?.title ||
      "Something went wrong. Please try again.";

    if (typeof messageText !== "string") {
      messageText = JSON.stringify(messageText);
    }
  }

  const alert = document.createElement("div");

  alert.className = "alert";
  alert.setAttribute("role", "alert");
  alert.setAttribute("aria-live", "assertive");

  const text = document.createElement("p");
  text.textContent = messageText;

  const closeButton = document.createElement("button");

  closeButton.type = "button";
  closeButton.className = "alert-close";
  closeButton.textContent = "Dismiss";
  closeButton.setAttribute("aria-label", "Dismiss error message");

  closeButton.addEventListener("click", () => {
    alert.remove();
  });

  alert.appendChild(text);
  alert.appendChild(closeButton);

  main.prepend(alert);

  if (scroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}