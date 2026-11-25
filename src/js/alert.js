export default class Alert {
  constructor(url = "../json/alerts.json") {
    this.url = url;
  }

  async init() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) throw new Error(`Could not load alerts (${res.status})`);
      const alerts = await res.json();
      this.render(alerts);
    } catch (err) {
      console.error("Alert error:", err);
    }
  }

  isActive(alert) {
    if (alert.expires && new Date() > new Date(`${alert.expires}T23:59:59`)) {
      return false;
    }
    try {
      if (sessionStorage.getItem(`alert-dismissed-${alert.id}`)) return false;
    } catch {
      /* storage unavailable, show the alert anyway */
    }
    return true;
  }

  render(alerts) {
    const active = alerts.filter((a) => this.isActive(a));
    if (!active.length) return;

    const section = document.createElement("section");
    section.className = "alert-list";

    active.forEach((alert) => {
      const banner = document.createElement("div");
      banner.className = "alert";
      banner.setAttribute("role", "alert");
      if (alert.background) banner.style.backgroundColor = alert.background;
      if (alert.color) banner.style.color = alert.color;

      const text = document.createElement("p");
      text.textContent = alert.message;
      banner.appendChild(text);

      if (alert.dismissible) {
        const btn = document.createElement("button");
        btn.className = "alert__close";
        btn.type = "button";
        btn.setAttribute("aria-label", "Dismiss alert");
        btn.textContent = "×";
        btn.addEventListener("click", () => {
          banner.remove();
          try {
            sessionStorage.setItem(`alert-dismissed-${alert.id}`, "1");
          } catch {
            /* ignore */
          }
          if (!section.children.length) section.remove();
        });
        banner.appendChild(btn);
      }

      section.appendChild(banner);
    });

    document.querySelector("main").prepend(section);
  }
}