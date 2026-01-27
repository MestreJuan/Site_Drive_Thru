require('dotenv').config();
const express = require('express');
const app = express();
const rotasProdutos = require('./routes/produtos');
const rotasUsuarios = require('./routes/usuarios');
const rotasPedidos = require('./routes/pedidos');

app.use(express.json());

app.use(express.static('public'));

app.use('/produtos', rotasProdutos);
app.use('/usuarios', rotasUsuarios);
app.use('/pedidos', rotasPedidos);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`); });