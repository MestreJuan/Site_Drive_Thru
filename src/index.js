//Como uma funcao main() em C, carregando bibliotecas e fazendo o loop de servidor
require('dotenv').config(); //funcao que carrega os dados do .env
const express = require('express'); //localiza a pasta express dentro do node_modules e retorna a funcao que gera o framework
const helmet = require('helmet'); //importa a segurança helmet para o servidor
const app = express(); //cria uma instancia de servidor com as configuracoes do site usando a funcao que foi puxada pelo express
app.use(helmet()); //sa a u
const rotasProdutos = require('./routes/produtos'); //importa o arquivo de rotas de produtos, executa ele e guarda o endereço na variavel
const rotasUsuarios = require('./routes/usuarios'); //importa o arquivo de rotas de usuarios, executa ele e guarda o endereço na variavel
const rotasPedidos = require('./routes/pedidos'); //importa o arquivo de rotas de pedidos, executa ele e guarda o endereço na variavel

app.use(express.json()); // transforma todos os dados, geralmente texto puro, vindos do HTML em objetos javascript

app.use(express.static('public')); //tranforma a pasta public e seu conteudo em publico na internet, sem precisar passar por banco de dados

app.use('/produtos', rotasProdutos); //manda para o arquivo de rota produtos se a URL comecar com /produtos
app.use('/usuarios', rotasUsuarios); //manda para o arquivo de rota usuarios se a URL comecar com /usuarios
app.use('/pedidos', rotasPedidos); //manda para o arquivo de rota pedidos se a URL comecar com /pedidos

const PORT = process.env.PORT || 3000; //faz tentativa de mandar para a porta do arquivo .env, caso nao exista, manda pro 3000

app.listen(PORT, '0.0.0.0', () => { console.log(`🚀 Servidor aberto na rede com a porta:${PORT}`); }); //inicia o loop do servidor como se fosse um while(1) e apenas quando conseguir ocupar a porta de destino, imprime o .log