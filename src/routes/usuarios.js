const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => 
{
    try 
    {
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        res.json(usuarios);
    } 
    catch (erro) 
    {
        res.status(500).json({ mensagem: 'Erro interno' });
    }
});

router.post('/cliente', async (req, res) => 
{
    const { nome, email, senha, cpf, telefone, endereco } = req.body;

    try 
    {
        const sqlUsuario = 'INSERT INTO usuarios (nome_completo, email, senha, tipo) VALUES (?, ?, ?, ?)';
        const [resultUsuario] = await db.query(sqlUsuario, [nome, email, senha, 'CLIENTE']);
        
        const novoId = resultUsuario.insertId; 

        const sqlCliente = 'INSERT INTO clientes (usuario_id, cpf, telefone, endereco_completo) VALUES (?, ?, ?, ?)';
        await db.query(sqlCliente, [novoId, cpf, telefone, endereco]);

        res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!', id: novoId });

    } 
    catch (erro)
    {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar cliente. Verifique se o E-mail ou CPF já existem.' });
    }
});

router.post('/funcionario', async (req, res) => 
{
    const { nome, email, senha, matricula, cargo, data_admissao } = req.body;

    try 
    {
        const sqlUsuario = 'INSERT INTO usuarios (nome_completo, email, senha, tipo) VALUES (?, ?, ?, ?)';
        const [resultUsuario] = await db.query(sqlUsuario, [nome, email, senha, 'FUNCIONARIO']);
        
        const novoId = resultUsuario.insertId;

        const sqlFunc = 'INSERT INTO funcionarios (usuario_id, matricula, cargo, data_admissao) VALUES (?, ?, ?, ?)';
        await db.query(sqlFunc, [novoId, matricula, cargo, data_admissao]);

        res.status(201).json({ mensagem: 'Funcionário cadastrado com sucesso!', id: novoId });

    } 
    catch (erro) 
    {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar funcionário.' });
    }
});

router.post('/login', async (req, res) =>
{
    const {email, senha} = req.body;

    if(!email || !senha)
    {
        return res.status(400).json({mensagem: 'Email e senha obrigatórios!'});
    }

    try
    {
        const [linhas] = await db.query
        (
            'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        if(linhas.length > 0)
        {
            const usuario = linhas[0];
            res.status(200).json
            ({
                mensagem: 'Login realizado',
                usuario: {id: usuario.id, nome: usuario.nome_completo, email: usuario.email, tipo: usuario.tipo}
            });
        }
        else
        {
            res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
        }
    }
    catch(error)
    {
        console.error('Erro no login: ', error);
        res.status(500).json({mensagem: 'Erro no servidor'});
    }
});

router.post('/cadastro', async (req, res) =>
{
    const { nome_completo, email, senha, cpf, telefone, endereco } = req.body;
    const connection = await db.getConnection();

    try 
    {
        await connection.beginTransaction();

        const [resultUsuario] = await connection.query
        (
            'INSERT INTO usuarios (nome_completo, email, senha, tipo) VALUES (?, ?, ?, ?)',
            [nome_completo, email, senha, 'CLIENTE'] 
        );

        const novoId = resultUsuario.insertId; 
       
        await connection.query
        (
            'INSERT INTO clientes (usuario_id, cpf, telefone, endereco_completo) VALUES (?, ?, ?, ?)',
            [novoId, cpf, telefone, endereco]
        );

        await connection.commit();
        res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!' });

    }
    catch (error) 
    {
        await connection.rollback(); 
        console.error('Erro no cadastro:', error);
        
        if (error.code === 'ER_DUP_ENTRY') 
        {
            res.status(400).json({ mensagem: 'Email ou CPF já cadastrados.' });
        }
        else
        {
            res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.' });
        }
    } 
    finally 
    {
        connection.release();
    }
});

router.put('/:id', async (req, res) => 
{
    const { id } = req.params; 
    const { telefone, endereco } = req.body; 

    try 
    {
        const connection = await db.getConnection(); 
        
        const query = 'UPDATE clientes SET telefone = ?, endereco_completo = ? WHERE usuario_id = ?';
        
        const [resultado] = await connection.query(query, [telefone, endereco, id]);
        
        connection.release(); 

        if (resultado.affectedRows === 0) 
        {
            console.log("Aviso: Nenhum cliente encontrado com esse usuario_id para atualizar.");
        }
        
        res.json({ mensagem: 'Dados atualizados com sucesso!' });
    } 
    catch (error) 
    {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar dados.' });
    }
});

module.exports = router;