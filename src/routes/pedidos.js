const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/', async (req, res) => {
    const { usuario_id, itens } = req.body;
    
    const connection = await db.getConnection();

    try 
    {
        await connection.beginTransaction();

        let valor_total = 0;
        for (const item of itens) 
        {
            valor_total += (item.preco * item.quantidade); // Note: usei item.preco (que vem do front)
        }

        const sqlPedido = 'INSERT INTO pedidos (usuario_id, valor_total, status, data_pedido) VALUES (?, ?, ?, NOW())';
        const [resultPedido] = await connection.query(sqlPedido, [usuario_id, valor_total, 'PENDENTE']);
        
        const idPedidoGerado = resultPedido.insertId;

        const sqlItem = 'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';

        for (const item of itens) 
            {
            await connection.query(sqlItem, [
                idPedidoGerado,
                item.id,        
                item.quantidade,
                item.preco
            ]);
        }

        await connection.commit();

        res.status(201).json(
        {
            mensagem: 'Pedido realizado com sucesso!',
            id_pedido: idPedidoGerado,
            total: valor_total
        });

    } 
    catch (erro) 
    {
        await connection.rollback();
        console.error('Erro ao processar pedido:', erro);
        res.status(500).json({ mensagem: 'Erro ao processar pedido.' });
    } 
    finally 
    {
        connection.release();
    }
});

router.get('/', async (req, res) => 
{
    try 
    {
        const query = `
            SELECT p.id_pedido, p.status, p.valor_total, p.data_pedido, u.nome_completo as nome_cliente
            FROM pedidos p
            INNER JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.status != 'ENTREGUE' AND p.status != 'CANCELADO'
            ORDER BY p.id_pedido ASC
        `;
        
        const [pedidos] = await db.query(query);
        res.json(pedidos);
    } 
    catch (erro) 
    {
        console.error('Erro ao buscar pedidos:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar pedidos.' });
    }
});

router.get('/:id', async (req, res) => 
{
    const idPedido = req.params.id; 
    try 
    {
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id_pedido = ?', [idPedido]);

        if (pedido.length === 0) 
        {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.json(pedido[0]);
    } 
    catch (erro) 
    {
        res.status(500).json({ mensagem: 'Erro ao buscar pedido' });
    }
});

router.put('/:id/status', async (req, res) => 
{
    const { id } = req.params;
    const { status } = req.body; 

    try 
    {
        await db.query('UPDATE pedidos SET status = ? WHERE id_pedido = ?', [status, id]);
        res.json({ mensagem: 'Status atualizado!' });
    }
    catch (error) 
    {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
});

router.get('/usuario/:id', async (req, res) => 
{
    const { id } = req.params;
    try 
    {
        const query = `
            SELECT id_pedido, status, valor_total, data_pedido 
            FROM pedidos 
            WHERE usuario_id = ? 
            ORDER BY id_pedido DESC
        `;
        const [pedidos] = await db.query(query, [id]);
        res.json(pedidos);
    } 
    catch (erro) 
    {
        console.error('Erro ao buscar pedidos do usuário:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar seus pedidos.' });
    }
});

module.exports = router;