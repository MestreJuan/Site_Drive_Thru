const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => 
{
    try 
    {
        const [linhas] = await db.query('SELECT * FROM produtos');
        res.json(linhas);
    }
    catch (erro) 
    {
        console.error('Erro ao buscar produtos:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

router.post('/', async (req, res) => 
{
    const { nome, descricao, preco, imagem_url, categoria_id } = req.body;

    try 
    {
        const query = `INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id) VALUES (?, ?, ?, ?, ?)`;
        
        await db.query(query, [nome, descricao, preco, imagem_url, categoria_id]);
        
        res.status(201).json({ mensagem: 'Produto criado com sucesso!' });
    } 
    catch (error) 
    {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

module.exports = router;