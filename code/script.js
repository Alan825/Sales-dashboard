const vendas = [
  { data: "2025-08-01", produto: "Banana", valor: 120 },
  { data: "2025-08-02", produto: "Maçã", valor: 90 },
  { data: "2025-08-03", produto: "Laranja", valor: 150 },
  { data: "2025-08-04", produto: "Tomate", valor: 200 }
];

const tabela = document.getElementById("tabela-vendas");
vendas.forEach(v => {
  let row = `<tr>
              <td>${v.data}</td>
              <td>${v.produto}</td>
              <td>R$ ${v.valor}</td>
            </tr>`;
  tabela.innerHTML += row;
});

let total = vendas.reduce((acc, v) => acc + v.valor, 0);
document.getElementById("total").textContent = total;

document.getElementById("produtos").textContent = vendas.length;
document.getElementById("clientes").textContent = 12;

new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: vendas.map(v => v.produto),
    datasets: [{
      label: "Vendas (R$)",
      data: vendas.map(v => v.valor),
      backgroundColor: "rgba(75, 192, 192, 0.6)"
    }]
  }
});

new Chart(document.getElementById("pieChart"), {
  type: "pie",
  data: {
    labels: vendas.map(v => v.produto),
    datasets: [{
      data: vendas.map(v => v.valor),
      backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"]
    }]
  }
});
