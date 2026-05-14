const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= GERAR NÚMERO ================= */
function gerarNumero(callback) {

  db.query(
    "SELECT numero_sorte FROM usuarios WHERE numero_sorte IS NOT NULL",
    (err, result) => {

      if (err) {
        return callback(err);
      }

      const usados = result.map(r => Number(r.numero_sorte));

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

    }
  );
}

/* ================= CADASTRO ================= */
app.post("/cadastro", (req, res) => {

  const { nome, whatsapp, email } = req.body;

  db.query(
    "INSERT INTO usuarios (nome, whatsapp, email, status) VALUES (?, ?, ?, 'pendente')",
    [nome, whatsapp, email],
    (err) => {

      if (err) {
        return res.json({ error: err });
      }

      res.json({
        success: true,
        message: "Cadastro realizado. Aguardando pagamento."
      });

    }
  );

});

/* ================= PAGAMENTO ================= */
app.put("/pagar/:id", (req, res) => {

  const id = req.params.id;

  gerarNumero((err, numero) => {

    if (err) {
      return res.json({ error: err });
    }

    db.query(
      "UPDATE usuarios SET status = 'pago', numero_sorte = ? WHERE id = ?",
      [numero, id],
      (err2) => {

        if (err2) {
          return res.json({ error: err2 });
        }

        res.json({
          success: true,
          numero_sorte: numero
        });

      }
    );

  });

});

/* ================= TOTAL CLIENTES ================= */
app.get("/total-clientes", (req, res) => {

  db.query(
    "SELECT COUNT(*) AS total FROM usuarios WHERE status = 'pago'",
    (err, result) => {

      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        total: result[0].total
      });

    }
  );

});

/* ================= LISTA ADMIN ================= */
app.get("/admin/clientes", (req, res) => {

  db.query(
    "SELECT * FROM usuarios ORDER BY id DESC",
    (err, result) => {

      if (err) {
        return res.json({ error: err });
      }

      res.json(result);

    }
  );

});

/* ================= ATUALIZAR STATUS ================= */
app.put("/cliente/:id", (req, res) => {

  const { status } = req.body;

  db.query(
    "UPDATE usuarios SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err) => {

      if (err) {
        return res.json({ error: err });
      }

      res.json({ success: true });

    }
  );

});

/* ================= CONSULTA CLIENTE ================= */
app.get("/cliente", (req, res) => {

  const { email } = req.query;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, result) => {

      if (err) {
        return res.json({ error: err });
      }

      if (result.length === 0) {
        return res.json({
          error: "Não encontrado"
        });
      }

      res.json(result[0]);

    }
  );

});

/* ================= LOGIN ADMIN ================= */
app.post("/login-admin", (req, res) => {

  const { senha } = req.body;

  if (senha === "1234") {

    return res.json({
      success: true
    });

  }

  return res.json({
    success: false
  });

});

/* ================= SERVIDOR ================= */
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});