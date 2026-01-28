const mysql = require('mysql2'); //importa a biblioteca que faz a ligacao com o banco de dados
require('dotenv').config(); //carrega os dados do .env

const connection = mysql.createPool //pool- o cliente usa um canal criado e sem uso no momento para pegar dados no banco e quando termina o canal não se fecha
(
    {
        host: process.env.DB_HOST, //localizacao do banco
        user: process.env.DB_USER, //login da conta mestre
        password: process.env.DB_PASS, //senha
        database: process.env.DB_NAME, //nome do banco
        waitForConnections: true, //comportamento de entrar na fila caso todos ocupados
        connectionLimit: 30, //define a quantidade de janelas ligadas ao banco ele vai ter ao mesmo tempo
        queueLimit: 0 //tamanho da fila de espera para cada uso, sendo 0 infinito ou até a memória RAM do servidor acabar
    }
);

module.exports = connection.promise(); //exporta essa funcao de conexao para poder ser usadas em outros arquivos
//o .promise encapsula a funcao para que nos outros arquivos possa ser escrito com await sem precisar fazer indetencao