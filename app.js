// GGTION ADMINISTRATIVO — Lógica de la página
// Consejos dinámicos según variación de la gráfica

AOS.init({ once: true, duration: 600, easing: 'ease-out' });

const $ = (sel) => document.querySelector(sel);

// Año actual en footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// Navegación rápida
document.getElementById('btnExplorar')?.addEventListener('click', () => {
  document.getElementById('panel')?.scrollIntoView({ behavior: 'smooth' });
});

// Modo oscuro
const darkSwitch = document.getElementById('darkMode');
if (darkSwitch) {
  darkSwitch.addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
  });
}

// Simulación de métricas
const metrics = { mIncidentes: 2, mIntrusiones: 15, mUptime: 99.97, mCriticas: 1 };
function renderMetrics() {
  for (const [id, val] of Object.entries(metrics)) {
    const el = document.getElementById(id);
    if (el) el.textContent = (typeof val === 'number' && id !== 'mCriticas')
      ? (id === 'mUptime' ? val.toFixed(2) : val)
      : val;
  }
}
renderMetrics();

// Chart
const ctx = document.getElementById('riesgosChart').getContext('2d');
const regiones = ['Américas', 'Europa', 'África', 'Asia', 'Oceanía'];
let datosIniciales = regiones.map(() => Math.floor(30 + Math.random() * 60));

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: regiones,
    datasets: [{
      label: 'Índice de Riesgo (0-100)',
      data: datosIniciales,
      borderWidth: 1
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
});

// Consejos dinámicos
const consejosBase = {
  bajo: [
    'Mantén políticas básicas de contraseñas seguras.',
    'Revisa accesos cada trimestre.',
    'Monitorea logs de eventos importantes.',
    'Asegura respaldos periódicos.'
  ],
  medio: [
    'Implementa autenticación multifactor en todas las cuentas.',
    'Actualiza parches críticos sin demora.',
    'Capacita al personal contra phishing.',
    'Revisa integridad de respaldos cifrados.'
  ],
  alto: [
    'Realiza pruebas de penetración trimestrales.',
    'Aplica segmentación estricta de red.',
    'Implementa SIEM y SOC para detección avanzada.',
    'Simula ataques de ingeniería social regularmente.'
  ]
};

const listaConsejos = document.getElementById('listaConsejos');
function renderConsejosPorRiesgo(promedio) {
  if (!listaConsejos) return;
  listaConsejos.innerHTML = '';
  let nivel = promedio < 40 ? 'bajo' : promedio < 70 ? 'medio' : 'alto';
  consejosBase[nivel].forEach((c) => {
    const li = document.createElement('li');
    li.textContent = c;
    listaConsejos.appendChild(li);
  });
}
renderConsejosPorRiesgo(datosIniciales.reduce((a,b)=>a+b,0)/datosIniciales.length);

function updateChartRandom() {
  chart.data.datasets[0].data = chart.data.datasets[0].data.map((v) => {
    const delta = Math.floor((Math.random() - 0.5) * 6);
    return Math.max(0, Math.min(100, v + delta));
  });
  chart.update();
  const promedio = chart.data.datasets[0].data.reduce((a,b)=>a+b,0)/chart.data.datasets[0].data.length;
  renderConsejosPorRiesgo(promedio);
}

// Intervalo de actualización
setInterval(() => {
  metrics.mIncidentes += Math.random() > 0.5 ? 1 : -1;
  metrics.mIntrusiones += Math.random() > 0.5 ? 2 : -2;
  metrics.mUptime = Math.min(100, Math.max(97.5, metrics.mUptime + (Math.random() - 0.5) * 0.05));
  metrics.mCriticas = Math.max(0, metrics.mCriticas + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0));
  renderMetrics();
  updateChartRandom();
}, 8000);
