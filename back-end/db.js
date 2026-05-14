const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "27011528",
  database: "Sorteios",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err) => {
  if (err) {
    console.log("Erro MySQL:", err);
  } else {
    console.log("MySQL conectado");
  }
});

module.exports = db;