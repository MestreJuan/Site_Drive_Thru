const express = require('express'); //localiza a pasta express dentro do node_modules e retorna a funcao que gera o framework
const router = express.Router(); //acumula todas as funcoes do modulo express dentro da variavel router
const db = require('../config/db'); //faz a ligacao com o banco de dados atraves do arquivo

router.get('/', async (req, res) => //router.get define que a funcao vai ser rodada  quando o usuario acessar /produtos/, sendo o /produtos enviado pelo index.js, entao aqui usa-se o '/'
{ 
    try 
    {
        const [linhas] = await db.query('SELECT * FROM produtos'); //copia o primeiro integrante da resposta do banco e coloca numa variavel chamada linhas. Essa resposta vem em [dados],[metadados] e por enquanto só precisa das linhas da tabela
        res.json(linhas); //devolve no formato json o conteudo das linhas
    }
    catch (erro) //tratamento de erro
    {
        console.error('Erro ao buscar produtos:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' }); //e da a opcao pro cliente tentar novamente
    }
});

router.post('/', async (req, res) =>  //rota que vai salvar o produto no banco de dados, tambem acessado apenas com '/' pois o index.js ja manda o /produtos
{
    const { nome, descricao, preco, imagem_url, categoria_id } = req.body; //req.body contem os dados em formato JSON que o front enviou, agora criamos variaveis para conter cada informacao

    try 
    {
        const query = `INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id) VALUES (?, ?, ?, ?, ?)`; //cria o comando para criar o novo produto no banco atraves da query. Pontos de interrogacao (placeholders) protegem o formato dos dados que entram 
        
        await db.query(query, [nome, descricao, preco, imagem_url, categoria_id]); //obriga a esperar essa acao acontecer
        
        res.status(201).json({ mensagem: 'Produto criado com sucesso!' }); //codigo de resposta para salvo com sucesso
    } 
    catch (error) 
    {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ mensagem: 'Erro no servidor' }); //codigo para erro interno
    }
});

module.exports = router; //torna todo o conteudo de router que foi criado no comeco publico e usavel por outros arquivos