console.log("%cIniciando verificação de funções globais do AmbienteOn...", "color: #22c55e; font-size: 16px; font-weight: bold;");

const checks = [
  { name: "initializeThemeAndAccessibility", type: "function" },
  { name: "initializeChatbot", type: "function" },
  { name: "initializeNormasLibrary", type: "function" },
  { name: "initializeNewsletter", type: "function" },
  { name: "calcularPegadaCarbono", type: "function" },
  { name: "showToast", type: "function" }
];

let passed = 0;
checks.forEach(check => {
  if (typeof window[check.name] === check.type) {
    console.log(`%c✅ ${check.name} existe.`, "color: #22c55e");
    passed++;
  } else {
    console.error(`❌ ${check.name} NÃO encontrada!`);
  }
});

console.log(`\n%cVerificação de elementos DOM críticos:`, "color: #60a5fa; font-weight: bold;");
const elements = [
  "theme-toggle", 
  "chatbot-widget", 
  "normas-library", 
  "newsletterForm", 
  "carbon-calculator",
  "map-container",
  "dashboard-container"
];

elements.forEach(id => {
  if (document.getElementById(id)) {
    console.log(`%c✅ Elemento #${id} encontrado.`, "color: #22c55e");
    passed++;
  } else {
    console.warn(`⚠️ Elemento #${id} não encontrado na página atual.`);
  }
});

console.log(`\n%cResultado: ${passed}/${checks.length + elements.length} verificações passaram.`, "font-size: 14px; font-weight: bold;");
