const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = new sqlite3.Database(':memory:');

// Crie a tabela de pratos
db.serialize(() => {
  db.run('CREATE TABLE pratos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, preco REAL)');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas CRUD
app.get('/pratos', (req, res) => {
  db.all('SELECT * FROM pratos', (err, rows) => {
    res.json(rows);
  });
});

app.post('/pratos', (req, res) => {
  const { nome, preco } = req.body;

  db.run('INSERT INTO pratos (nome, preco) VALUES (?, ?)', [nome, preco], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ id: this.lastID });
  });
});

app.put('/pratos/:id', (req, res) => {
  const { nome, preco } = req.body;
  const id = req.params.id;

  db.run('UPDATE pratos SET nome = ?, preco = ? WHERE id = ?', [nome, preco, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Prato atualizado com sucesso' });
  });
});

app.delete('/pratos/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM pratos WHERE id = ?', id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Prato removido com sucesso' });
  });
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
