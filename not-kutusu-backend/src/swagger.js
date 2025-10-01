// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Not Kutusu API",
      version: "1.0.0",
      description: "Üniversite not paylaşım platformu için API dökümantasyonu"
    },
    servers: [{ url: "http://localhost:5050/api" }]
  },
  apis: ["./src/docs/swaggerDefinitions.js"], // yalnızca tek dosyadan okur
};

const swaggerSpec = swaggerJsdoc(options);

const customCss = `
:root {
  color-scheme: light dark;
}

body {
  transition: background-color 0.2s ease, color 0.2s ease;
}

body.swagger-dark {
  background-color: #0f172a;
  color: #e2e8f0;
}

body.swagger-light {
  background-color: #f8fafc;
  color: #0f172a;
}

.swagger-ui .topbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

#swagger-theme-bar,
#swagger-theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

#swagger-theme-bar {
  justify-content: flex-end;
  padding: 12px 16px;
}

body.swagger-dark #swagger-theme-bar {
  background-color: #111827;
  border-bottom: 1px solid #1f2937;
  color: #e2e8f0;
}

body.swagger-light #swagger-theme-bar {
  background-color: #f8fafc;
  border-bottom: 1px solid #cbd5f5;
  color: #0f172a;
}

.swagger-theme-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.75;
}

.swagger-theme-buttons {
  display: flex;
  gap: 6px;
}

.swagger-theme-button {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid currentColor;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

body.swagger-dark .swagger-theme-button {
  color: #e2e8f0;
  border-color: #334155;
  background-color: #1e293b;
}

body.swagger-light .swagger-theme-button {
  color: #1e293b;
  border-color: #cbd5f5;
  background-color: #e2e8f0;
}

.swagger-theme-button.active {
  background-color: #0ea5e9 !important;
  border-color: #0ea5e9 !important;
  color: #0f172a !important;
}

#swagger-theme-bar .swagger-theme-button:hover,
#swagger-theme-toggle .swagger-theme-button:hover {
  filter: brightness(1.05);
}

body.swagger-dark .swagger-ui,
body.swagger-dark .swagger-ui .information-container,
body.swagger-dark .swagger-ui .scheme-container,
body.swagger-dark .swagger-ui section.models,
body.swagger-dark .swagger-ui .opblock,
body.swagger-dark .swagger-ui .model-container,
body.swagger-dark .swagger-ui .responses-inner,
body.swagger-dark .swagger-ui .responses-table tr,
body.swagger-dark .swagger-ui table tbody tr,
body.swagger-dark .swagger-ui table thead tr {
  background-color: #111827;
  color: #e2e8f0;
}

body.swagger-dark .swagger-ui .topbar {
  background-color: #111827;
  border-bottom: 1px solid #1f2937;
}

body.swagger-light .swagger-ui .topbar {
  background-color: #f8fafc;
  border-bottom: 1px solid #cbd5f5;
}

body.swagger-dark .swagger-ui .markdown code,
body.swagger-dark .swagger-ui .response-col_description__inner,
body.swagger-dark .swagger-ui .response-col_status,
body.swagger-dark .swagger-ui .response-col_description {
  color: #e2e8f0;
}

body.swagger-dark .swagger-ui .btn,
body.swagger-dark .swagger-ui select,
body.swagger-dark .swagger-ui input,
body.swagger-dark .swagger-ui textarea {
  background-color: #1f2937;
  color: #e2e8f0;
  border-color: #334155;
}

body.swagger-dark .swagger-ui .btn.authorize {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
  color: #0f172a;
}

body.swagger-dark .swagger-ui .parameters-col_description,
body.swagger-dark .swagger-ui .parameter__name,
body.swagger-dark .swagger-ui .property-deprecated {
  color: #e2e8f0;
}

body.swagger-dark .swagger-ui .opblock-tag,
body.swagger-dark .swagger-ui .opblock-summary-path,
body.swagger-dark .swagger-ui .opblock-summary-method,
body.swagger-dark .swagger-ui .opblock-summary-description,
body.swagger-dark .swagger-ui .opblock-section-header h4 {
  color: #ffffff;
}

body.swagger-dark .swagger-ui .opblock-summary {
  background-color: #1f2937;
  border-color: #334155;
}

body.swagger-dark .swagger-ui .opblock {
  border-color: #334155;
}
`;

const themeToggleScript = `(() => {
  const STORAGE_KEY = 'swagger-theme';
  const MODE_LABELS = { system: '🖥️ Sistem', light: '☀️ Açık', dark: '🌙 Koyu' };
  const MODES = Object.keys(MODE_LABELS);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme() {
    return window.localStorage.getItem(STORAGE_KEY) || 'system';
  }

  function setStoredTheme(value) {
    window.localStorage.setItem(STORAGE_KEY, value);
  }

  function getEffectiveTheme(selected) {
    if (selected === 'system') {
      return mediaQuery.matches ? 'dark' : 'light';
    }
    return selected;
  }

  function updateActiveButtons(selected) {
    document.querySelectorAll('.swagger-theme-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === selected);
    });
  }

  function applyTheme(mode, persist = true) {
    const selected = mode || getStoredTheme();
    const effective = getEffectiveTheme(selected);
    document.body.classList.remove('swagger-dark', 'swagger-light');
    document.body.classList.add(effective === 'dark' ? 'swagger-dark' : 'swagger-light');
    if (persist) {
      setStoredTheme(selected);
    }
    updateActiveButtons(selected);
  }

  function mountButtons(container) {
    if (!container) return;
    container.innerHTML = '';
    MODES.forEach(mode => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swagger-theme-button';
      btn.dataset.mode = mode;
      btn.textContent = MODE_LABELS[mode];
      btn.addEventListener('click', () => applyTheme(mode));
      container.appendChild(btn);
    });
  }

  function ensurePageTopBar() {
    let bar = document.getElementById('swagger-theme-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'swagger-theme-bar';
      const label = document.createElement('span');
      label.className = 'swagger-theme-label';
      label.textContent = 'Tema';
      bar.appendChild(label);
      const buttons = document.createElement('div');
      buttons.className = 'swagger-theme-buttons';
      bar.appendChild(buttons);
      const swaggerRoot = document.getElementById('swagger-ui');
      if (swaggerRoot && swaggerRoot.parentNode) {
        swaggerRoot.parentNode.insertBefore(bar, swaggerRoot);
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    }

    const buttonHolder = bar.querySelector('.swagger-theme-buttons');
    mountButtons(buttonHolder);
  }

  function ensureTopbarButtons() {
    const topbar = document.querySelector('.swagger-ui .topbar');
    if (!topbar) return;
    const wrapper = topbar.querySelector('.wrapper') || topbar;
    let container = wrapper.querySelector('#swagger-theme-toggle');
    if (!container) {
      container = document.createElement('div');
      container.id = 'swagger-theme-toggle';
      wrapper.appendChild(container);
    }
    mountButtons(container);
  }

  function init() {
    ensurePageTopBar();
    ensureTopbarButtons();
    applyTheme(getStoredTheme(), false);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

  window.addEventListener('load', init);

  const onSystemPreferenceChange = () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system', false);
    }
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onSystemPreferenceChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(onSystemPreferenceChange);
  }
})();`;

const swaggerUiOptions = {
  customCss,
  customSiteTitle: "Not Kutusu API Dokümantasyonu",
  customJs: "/swagger-theme-toggle.js",
  swaggerOptions: {
    persistAuthorization: true,
  }
};

module.exports = { swaggerUi, swaggerSpec, swaggerUiOptions, themeToggleScript };
