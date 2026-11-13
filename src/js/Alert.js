export default class Alert {
  constructor() {
    this.alerts = [];
  }

  async init() {
    const mainElement = document.querySelector("main");

    if (!mainElement) {
      // eslint-disable-next-line no-console
      console.error("Main element not found.");
      return;
    }

    try {
      const response = await fetch("/json/alerts.json");

      if (!response.ok) {
        throw new Error("Unable to load alerts.");
      }

      this.alerts = await response.json();

      if (!this.alerts.length) {
        return;
      }

      const alertSection = document.createElement("section");
      alertSection.classList.add("alert-list");

      this.alerts.forEach((alert) => {
        const paragraph = document.createElement("p");

        paragraph.textContent = alert.message;
        paragraph.style.backgroundColor = alert.background;
        paragraph.style.color = alert.color;

        alertSection.appendChild(paragraph);
      });

      mainElement.prepend(alertSection);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error loading alerts:", error);
    }
  }
}
