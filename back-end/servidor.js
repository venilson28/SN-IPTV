const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= GERAR NÚMERO ÚNICO ================= */
function gerarNumeroUnico(callback) {
  db.query("SELECT numero_sorte FROM usuarios", (err, result) => {
    if (err) return callback(err);

    const usados = result.map(r => r.numero_sorte);

    const disponiveis = [];

    for (let i = 1; i <= 1000; i++) {
      if (!usados.includes(i)) {
        disponiveis.push(i);
      }
    }

    if (disponiveis.length === 0) {
      return callback("Sem números disponíveis");
    }

    const numero =
      disponiveis[Math.floor(Math.random() * disponiveis.length)];

    callback(null, numero);
  });
}

/* ================= CADASTRO ================= */
app.post("/cadastro", (req, res) => {
  const { nome, whatsapp, email } = req.body;

  // limite 1000
  db.query("SELECT COUNT(*) AS total FROM usuarios", (err, result) => {
    if (result[0].total >= 1000) {
      return res.json({ error: "Limite de 1000 usuários atingido" });
    }

    // duplicado
    db.query(
      "SELECT * FROM usuarios WHERE email = ? OR whatsapp = ?",
      [email, whatsapp],
      (err, user) => {
        if (user.length > 0) {
          return res.json({ error: "Usuário já cadastrado" });
        }

        // gerar número e salvar
        gerarNumeroUnico((err, numero) => {
          if (err) return res.json({ error: err });

          db.query(
            "INSERT INTO usuarios (nome, whatsapp, email, numero_sorte) VALUES (?, ?, ?, ?)",
            [nome, whatsapp, email, numero],
            (err, result) => {
              if (err) return res.json({ error: err });

              res.json({
                success: true,
                numero_sorte: numero
              });
            }
          );
        });
      }
    );
  });
});

/* ================= TOTAL CLIENTES ================= */
app.get("/total-clientes", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM usuarios";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      total: result[0].total
    });
  });
});

/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});