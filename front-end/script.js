
/* ================= CAROUSEL ================= */
const carousel = document.getElementById("carousel");

if (carousel) {
  let position = 0;
  let speed = 0.6;

  function animate() {
    position += speed;

    if (position >= carousel.scrollWidth - carousel.clientWidth) {
      position = 0;
    }

    carousel.scrollLeft = position;
    requestAnimationFrame(animate);
  }

  animate();
}


/* ================= HEADER ================= */
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (!header) return;

  header.style.backgroundColor =
    window.scrollY > 200 ? "black" : "transparent";
});


/* ================= ANIMAÇÃO CARDS ================= */
const cards = document.querySelectorAll(".card-plano");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visivel");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));


/* ================= TÍTULOS ================= */
const titulos = document.querySelectorAll(".titulo");

const observerTitulos = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visivel");
      observerTitulos.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

titulos.forEach(t => observerTitulos.observe(t));


/* ================= CRONÔMETRO ================= */
const dataFinal = new Date("2026-12-31 23:59:59").getTime();

function atualizarCronometro() {
  const d = document.getElementById("dias");
  const h = document.getElementById("horas");
  const m = document.getElementById("minutos");
  const s = document.getElementById("segundos");

  if (!d || !h || !m || !s) return;

  const agora = Date.now();
  const distancia = dataFinal - agora;

  d.innerText = Math.floor(distancia / 86400000);
  h.innerText = Math.floor((distancia % 86400000) / 3600000);
  m.innerText = Math.floor((distancia % 3600000) / 60000);
  s.innerText = Math.floor((distancia % 60000) / 1000);
}

setInterval(atualizarCronometro, 1000);
atualizarCronometro();


/* ================= MODAL ================= */
const btn = document.getElementById("btnRegras");
const modal = document.getElementById("modalRegras");
const fechar = document.getElementById("fecharModal");

if (btn && modal && fechar) {
  btn.addEventListener("click", () => modal.style.display = "flex");

  fechar.addEventListener("click", () => modal.style.display = "none");

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}


/* ================= FORM ================= */
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.querySelector("[name='nome']").value;
    const whatsapp = form.querySelector("[name='whatsapp']").value;
    const email = form.querySelector("[name='email']").value;

    const res = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, whatsapp, email })
    });

    const data = await res.json();

    const resultado = document.getElementById("resultado-sorte");

    if (resultado) {
      resultado.innerHTML = data.error
        ? data.error
        : "🎉 Seu número da sorte: " + data.numero_sorte;

      resultado.classList.add("ativo");
    }

    carregarClientes();
  });
}


/* ================= CONTADOR MYSQL ================= */
const totalClientes = document.getElementById("total-clientes");
const barra = document.getElementById("barra-progresso");
const restam = document.getElementById("restam-vagas");

function atualizarContador(total) {
  if (!totalClientes || !barra || !restam) return;

  totalClientes.innerText = total;

  const porcentagem = (total / 1000) * 100;
  barra.style.width = porcentagem + "%";

  const vagas = 1000 - total;
  restam.innerText = `RESTAM ${vagas} VAGAS`;
}
async function carregarClientes() {
  const res = await fetch("http://localhost:3000/total-clientes");
  const data = await res.json();

  atualizarContador(data.total);
}

carregarClientes();


/* ================= RESET SCROLL ================= */
window.onload = () => window.scrollTo(0, 0);