document.addEventListener('DOMContentLoaded', () => {
  carregarDados();

  // Dark Mode
  document.getElementById('toggle-dark').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // Filtro de produtos
  document.getElementById('filtro-produto').addEventListener('input', aplicarFiltros);
  document.getElementById('filtro-min').addEventListener('input', aplicarFiltros);
  document.getElementById('filtro-max').addEventListener('input', aplicarFiltros);
});

let chartInstance = null;
let vendasGlobais = [];
const dinheiro = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

async function carregarDados() {
  try {
    const res = await fetch('sales.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    vendasGlobais = await res.json();

    atualizarDashboard(vendasGlobais);

  } catch (err) {
    console.error('Erro ao carregar JSON:', err);
    alert('Erro ao carregar dados. Veja o console (F12).');
  }
}

function atualizarDashboard(vendas) {
  preencherTabela(vendas);
  atualizarCards(vendas);
  criarGrafico(vendas);
}

function preencherTabela(vendas) {
  const tbody = document.getElementById('tabela-vendas');
  tbody.innerHTML = '';
  vendas.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.produto}</td>
      <td>${v.quantidade}</td>
      <td>${dinheiro.format(Number(v.valor))}</td>
    `;
    tbody.appendChild(tr);
  });
}

function atualizarCards(vendas) {
  const totalVendas = vendas.reduce((s, v) => s + Number(v.valor), 0);
  const totalProdutos = vendas.reduce((s, v) => s + Number(v.quantidade), 0);
  const mediaVendas = totalVendas / vendas.length;
  const maisVendido = vendas.reduce((prev, curr) => (curr.quantidade > prev.quantidade ? curr : prev)).produto;

  document.getElementById('total-vendas').textContent = dinheiro.format(totalVendas);
  document.getElementById('total-produtos').textContent = totalProdutos;
  document.getElementById('media-vendas').textContent = dinheiro.format(mediaVendas);
  document.getElementById('mais-vendido').textContent = maisVendido;
}

function criarGrafico(vendas) {
  const ctx = document.getElementById('grafico-vendas').getContext('2d');
  const labels = vendas.map(v => v.produto);
  const data = vendas.map(v => Number(v.valor));
  const colors = vendas.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Vendas (R$)', data, backgroundColor: colors }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// Filtros avançados
function aplicarFiltros() {
  const filtroProduto = document.getElementById('filtro-produto').value.toLowerCase();
  const minValor = parseFloat(document.getElementById('filtro-min').value) || -Infinity;
  const maxValor = parseFloat(document.getElementById('filtro-max').value) || Infinity;

  const vendasFiltradas = vendasGlobais.filter(v => {
    const nome = v.produto.toLowerCase();
    const valor = Number(v.valor);
    return nome.includes(filtroProduto) && valor >= minValor && valor <= maxValor;
  });

  atualizarDashboard(vendasFiltradas);
}
