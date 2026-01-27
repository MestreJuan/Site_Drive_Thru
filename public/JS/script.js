document.addEventListener('DOMContentLoaded', () => 
{
    const formularioLogin = document.getElementById('form-login');

    if (formularioLogin) 
    {
        formularioLogin.addEventListener('submit', async (evento) => 
        {
            evento.preventDefault();
            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('senha').value;

            try
            {
                const resposta = await fetch('/usuarios/login',
                {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                    {
                        email: emailDigitado,
                        senha: senhaDigitada
                    })
                });

                const dados = await resposta.json();

                if (resposta.ok)
                {
                    alert('Login realizado');
                    localStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));
                    if (dados.usuario.tipo === 'FUNCIONARIO') 
                    {
                        window.location.href = 'admin.html';
                    } 
                    else 
                    {
                        window.location.href = 'index.html';
                    }
                }
                else
                {
                    alert('Erro ' + dados.mensagem);
                }
            }
            catch(erro)
            {
                console.error('Erro na requisição: ', erro);
                alert('Servidor desligado ou com problema');
            }
        });
    }

    const formCadastro = document.getElementById('form-cadastro');

    if (formCadastro)
    {
        formCadastro.addEventListener('submit', async (evento) => 
        {
            evento.preventDefault();

            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const telefone = document.getElementById('telefone').value;
            const endereco = document.getElementById('endereco').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirma = document.getElementById('ConfirmaSenha').value;

            if (senha !== confirma)
            {
                alert("As senhas estão diferentes");
                return;
            }

            try
            {
                const resposta = await fetch('/usuarios/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify
                    ({
                        nome_completo: nome, 
                        cpf: cpf,
                        telefone: telefone,
                        endereco: endereco,
                        email: email,
                        senha: senha
                    })
                });

                const dados = await resposta.json();

                if (resposta.ok)
                {
                    alert("Conta criada com sucesso!");
                    window.location.href = 'login.html'; 
                }
                else
                {
                    alert("Erro ao cadastrar: " + dados.mensagem);
                }
            }
            catch(erro)
            {
                console.error('Erro no cadastro: ', erro);
                alert("Erro de conexão com o servidor");
            }
        });
    }

    function atualizarMenu()
    {
        const menuVisitante = document.getElementById('menu-visitante');
        const menuUsuario = document.getElementById('menu-usuario');
        const nomeHeader = document.getElementById('nome-usuario-header');
        const btnSair = document.getElementById('btn-sair-header');
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        const linkAdmin = document.getElementById('link-admin');

        if (usuarioLogado && menuUsuario && menuVisitante)
        {
            const usuario = JSON.parse(usuarioLogado);
            menuVisitante.style.display = 'none';
            menuUsuario.style.display = 'flex';

            if (nomeHeader)
            {
                nomeHeader.innerText = usuario.nome || usuario.nome_completo;
                nomeHeader.innerHTML = `<a href="perfil.html" style="color: inherit; text-decoration: none;">👤 ${usuario.nome || usuario.nome_completo}</a>`;
            }

            if (usuario.tipo === 'FUNCIONARIO') 
            {
                if (linkAdmin) 
                {
                    linkAdmin.style.display = 'inline-block'; 
                }
            } 
            else 
            {
                if (linkAdmin) 
                {
                    linkAdmin.style.display = 'none'; 
                }
            }

            if (btnSair)
            {
                btnSair.onclick = () =>
                {
                    localStorage.removeItem('usuarioLogado');
                    window.location.reload();
                };
            }
        }
        else if (menuUsuario && menuVisitante)
        {
            menuVisitante.style.display = 'flex';
            menuUsuario.style.display = 'none';
        }
    }

    atualizarMenu();

    const btnLogoutAdmin = document.getElementById('btn-logout');

    if (btnLogoutAdmin) 
    {
        btnLogoutAdmin.addEventListener('click', () => 
        {
            localStorage.removeItem('usuarioLogado');
            
            alert('Até logo, Chefe');
            
            window.location.href = 'index.html';
        });
    }

    const formProduto = document.getElementById('form-produto');

    if (formProduto) 
    {
        formProduto.addEventListener('submit', async (e) => 
        {
            e.preventDefault();

            const produto = 
            {
                nome: document.getElementById('prod-nome').value,
                descricao: document.getElementById('prod-desc').value,
                preco: document.getElementById('prod-preco').value,
                imagem_url: document.getElementById('prod-img').value,
                categoria_id: document.getElementById('prod-categoria').value
            };

            try 
            {
                const resposta = await fetch('/produtos', 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(produto)
                });

                if (resposta.ok) 
                {
                    alert("Produto cadastrado no cardápio!");
                    formProduto.reset(); 
                } 
                else 
                {
                    alert("Erro ao cadastrar.");
                }
            } 
            catch (erro) 
            {
                console.error(erro);
                alert("Erro de conexão.");
            }
        });
    }

    const listaProdutos = document.getElementById('lista-produtos');

    if (listaProdutos) 
    {
        carregarCardapio();
    }

    async function carregarCardapio() 
    {
        try 
        {
            const resposta = await fetch('/produtos'); // Chama o Back-end
            const produtos = await resposta.json();

            listaProdutos.innerHTML = '';

            produtos.forEach(produto => 
            {
                const cartao = `
                    <div class="cartao-produto">
                        <img src="${produto.imagem_url}" alt="${produto.nome}">
                        <div class="info-produto">
                            <h3>${produto.nome}</h3>
                            <p>${produto.descricao}</p>
                            <span class="preco">R$ ${produto.preco}</span>
                            <button onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco})">Adicionar</button>
                        </div>
                    </div>
                `;
                listaProdutos.innerHTML += cartao;
            });
        } 
        catch (erro) 
        {
            console.error(erro);
            listaProdutos.innerHTML = '<p>Erro ao carregar cardápio :(</p>';
        }
    }

    window.adicionarAoCarrinho = function(id, nome, preco) 
    {
        let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];

        const itemExistente = carrinho.find(item => item.id === id);

        if (itemExistente) 
        {
            itemExistente.quantidade += 1;
        } 
        else 
        {
            carrinho.push({ id, nome, preco: parseFloat(preco), quantidade: 1 });
        }

        localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));

        alert(`😋 ${nome} adicionado ao pedido!`);
        atualizarContadorCarrinho();
    };

    function atualizarContadorCarrinho() 
    {
        const carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

        const spanContador = document.getElementById('cont-carrinho');

        if (spanContador) 
        {
            spanContador.innerText = `(${totalItens})`;
        }
    }

    atualizarContadorCarrinho();

    window.renderizarCarrinho = function()
    {
        const divItens = document.getElementById('itens-carrinho');
        const spanTotal = document.getElementById('valor-total');

        if (!divItens)
        {
            return;
        }

        const carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];

        if (carrinho.length === 0) 
        {
            divItens.innerHTML = '<p style="text-align: center;">Seu carrinho está vazio 😢 <br> <a href="cardapio.html">Voltar para o Cardápio</a></p>';
            spanTotal.innerText = 'R$ 0,00';
            return;
        }

        divItens.innerHTML = '';
        let totalConta = 0;

        carrinho.forEach(item => 
        {
            const totalItem = item.preco * item.quantidade;
            totalConta += totalItem;

            const html = `
            <div class="item-carrinho">
            <div class="item-info">
                <h4>${item.nome}</h4> <span>R$ ${item.preco} x ${item.quantidade}</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="item-total">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                
                <button onclick="removerItemCarrinho(${item.id})" class="btn-lixeira" title="Remover item">
                    🗑️
                </button>
            </div>
            </div>
            `;

            carrinho.innerHTML += html;
        });

        spanTotal.innerText = `R$ ${totalConta.toFixed(2)}`;
    };

    window.limparCarrinho = function() 
    {
        localStorage.removeItem('meuCarrinho');
        renderizarCarrinho(); // Redesenha a tela (vai aparecer vazio)
        atualizarContadorCarrinho(); // Zera o número lá em cima
    };

    window.finalizarPedido = function() 
    {
        const carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
        if (carrinho.length === 0) 
        {
            alert("Coloque algo no carrinho primeiro!");
            return;
        }

        alert("Pedido enviado para a cozinha! 👨‍🍳");
        limparCarrinho();
        window.location.href = 'index.html';
    };

    const divItensCarrinho = document.getElementById('itens-carrinho');

    if (divItensCarrinho) 
    {
        // Se essa div existe, o JS sabe que está na página carrinho.html
        renderizarCarrinho(); 
    }

    window.abrirModalPagamento = function() {
        const carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        if (carrinho.length === 0) 
        {
            alert("Carrinho vazio!");
            return;
        }

        if (!usuarioLogado) 
        {
            alert("Faça login para continuar!");
            window.location.href = 'login.html';
            return;
        }

        const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        
        document.getElementById('valor-pix-texto').innerText = `R$ ${total.toFixed(2)}`;

        // DADOS DO RECEBEDOR (VOCÊ)
        // Substitua pela SUA chave (CPF, Email, Telefone ou Aleatória)
        const minhaChavePix = "juangregoriodecastro@gmail.com"; 
        const meuNome = "Juan Castro"; // Seu nome (sem acentos é melhor)
        const minhaCidade = "Osasco";   // Sua cidade (sem acentos)
        const idTransacao = "DriveThru"; // Um código para identificar 

        // 1. Gera o textão que o banco entende (EMV)
        const payloadPix = gerarPayloadPix(minhaChavePix, meuNome, minhaCidade, total, idTransacao);
        
        // 2. Coloca o textão no campo "Copia e Cola" (pra ficar bonito)
        const campoCopiaCola = document.getElementById('pix-copia-cola');
        if (campoCopiaCola) 
        {
            // Corta o texto pra não ficar gigante na tela, mas guarda tudo
            campoCopiaCola.innerText = payloadPix.substring(0, 30) + "...";
            campoCopiaCola.title = payloadPix; // Se passar o mouse vê tudo
            
            // DICA EXTRA: Clique para copiar
            campoCopiaCola.onclick = () => 
            {
                navigator.clipboard.writeText(payloadPix);
                alert("Código Pix copiado!");
            };
            campoCopiaCola.style.cursor = "pointer";
        }

        // 3. Gera a Imagem do QR Code baseada nesse texto
        // O comando encodeURIComponent é vital para não quebrar o link com caracteres especiais
        const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payloadPix)}`;
        
        document.getElementById('img-qrcode').src = urlQR;
        document.getElementById('modal-pix').style.display = 'flex';
    };

    window.fecharModal = function() 
    {
        document.getElementById('modal-pix').style.display = 'none';
    };

    window.confirmarPagamento = async function() 
    {
        const carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

        const pacotePedido = 
        {
            usuario_id: usuarioLogado.id,
            total: total,
            itens: carrinho
        };

        try 
        {
            const resposta = await fetch('/pedidos', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacotePedido)
            });

            if (resposta.ok) 
            {
                const dados = await resposta.json();
                
                fecharModal(); 
                limparCarrinho(); 
                
                alert(`Pagamento confirmado! Pedido #${dados.id_pedido} enviado para a cozinha! 🍔`);
                window.location.href = 'index.html';
            } 
            else 
            {
                alert("Erro ao salvar pedido.");
            }
        } 
        catch (erro) 
        {
            console.error(erro);
            alert("Erro de conexão.");
        }
    };

    
    function gerarPayloadPix(chave, nome, cidade, valor, txid) {
        // Formata os dados básicos
        const nomeTratado = removerAcentos(nome).substring(0, 25).toUpperCase();
        const cidadeTratada = removerAcentos(cidade).substring(0, 15).toUpperCase();
        const valorTratado = parseFloat(valor).toFixed(2);
        
        // 1. Payload Format Indicator
        const f00 = '000201';
        
        // 2. Merchant Account Information (Chave Pix)
        // GUI (br.gov.bcb.pix) + Chave
        const gui = '0014BR.GOV.BCB.PIX';
        const chaveLen = chave.length.toString().padStart(2, '0');
        const campoChave = `01${chaveLen}${chave}`;
        const merchantAccountContent = gui + campoChave;
        const f26 = `26${merchantAccountContent.length.toString().padStart(2, '0')}${merchantAccountContent}`;
        
        // 3. Merchant Category Code (52040000 = Geral)
        const f52 = '52040000';
        
        // 4. Transaction Currency (986 = Real)
        const f53 = '5303986';
        
        // 5. Transaction Amount (Valor)
        const valorLen = valorTratado.length.toString().padStart(2, '0');
        const f54 = `54${valorLen}${valorTratado}`;
        
        // 6. Country Code
        const f58 = '5802BR';
        
        // 7. Merchant Name
        const nomeLen = nomeTratado.length.toString().padStart(2, '0');
        const f59 = `59${nomeLen}${nomeTratado}`;
        
        // 8. Merchant City
        const cidadeLen = cidadeTratada.length.toString().padStart(2, '0');
        const f60 = `60${cidadeLen}${cidadeTratada}`;
        
        // 9. Additional Data Field Template (TxID)
        // Usando *** para compatibilidade máxima
        const f62 = '62070503***';
        
        // 10. CRC16 (Onde a mágica acontece)
        const payloadSemCRC = f00 + f26 + f52 + f53 + f54 + f58 + f59 + f60 + f62 + '6304';
        
        const crc = crc16(payloadSemCRC);
        
        return payloadSemCRC + crc;
    }

    // Função para remover acentos
    function removerAcentos(texto) 
    {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Calculadora CRC16 (Polinômio 0x1021)
    function crc16(buffer) 
    {
        let crc = 0xFFFF;
        for (let i = 0; i < buffer.length; i++) 
        {
            crc ^= buffer.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) 
            {
                if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
                else crc = crc << 1;
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    window.carregarPedidosAdmin = async function() 
    {
        const divLista = document.getElementById('lista-pedidos-admin');
        if (!divLista) return;

        try 
        {
            const resposta = await fetch('/pedidos');
            const pedidos = await resposta.json();

            divLista.innerHTML = '';

            if (pedidos.length === 0) 
            {
                divLista.innerHTML = '<p>Nenhum pedido na fila. Hora de descansar! 😴</p>';
                return;
            }

            pedidos.forEach(pedido => 
            {
                let corStatus = '#ccc';
                if (pedido.status === 'PENDENTE') corStatus = 'orange';
                if (pedido.status === 'PRONTO') corStatus = 'green';

                const html = `
                    <div style="background: white; padding: 20px; border-left: 10px solid ${corStatus}; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3>Pedido #${pedido.id_pedido} - ${pedido.nome_cliente}</h3>
                            <p>Status: <strong>${pedido.status}</strong></p>
                            <p>Total: R$ ${pedido.valor_total}</p>
                        </div>
                        <div>
                            ${pedido.status === 'PENDENTE' ? 
                                `<button onclick="mudarStatus(${pedido.id_pedido}, 'PRONTO')" style="background: green; color: white; padding: 10px; border: none; cursor: pointer; border-radius: 5px;">✅ Pronto</button>` 
                                : ''}
                            
                            ${pedido.status === 'PRONTO' ? 
                                `<button onclick="mudarStatus(${pedido.id_pedido}, 'ENTREGUE')" style="background: #333; color: white; padding: 10px; border: none; cursor: pointer; border-radius: 5px;">🚀 Entregar</button>` 
                                : ''}
                        </div>
                    </div>
                `;
                divLista.innerHTML += html;
            });
        }
        catch (erro) 
        {
            console.error(erro);
            divLista.innerHTML = '<p>Erro ao carregar pedidos.</p>';
        }
    };

    window.mudarStatus = async function(id, novoStatus) 
    {
        if(!confirm(`Mudar pedido #${id} para ${novoStatus}?`))
        {
            return;
        }

        try 
        {
            await fetch(`/pedidos/${id}/status`, 
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus })
            });

            carregarPedidosAdmin(); 
        } 
        catch (erro) 
        {
            alert("Erro ao atualizar.");
        }
    };

    const formAtualizar = document.getElementById('form-atualizar-dados');

    if (formAtualizar) 
    {
        formAtualizar.addEventListener('submit', async function(event) 
        {
            event.preventDefault(); 

            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

            const novoTelefone = document.getElementById('perfil-telefone').value;
            const novoEndereco = document.getElementById('perfil-endereco').value;
            
            const btnSalvar = document.querySelector('#form-atualizar-dados button');
            const textoOriginal = btnSalvar.innerText;
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;

            try 
            {
                const resposta = await fetch(`/usuarios/${usuarioLogado.id}`, 
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        telefone: novoTelefone,
                        endereco: novoEndereco
                    })
                });

                if (resposta.ok) 
                {
                    usuarioLogado.telefone = novoTelefone;
                    usuarioLogado.endereco = novoEndereco;
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

                    alert("Dados salvos no sistema com sucesso! 💾✅");
                } 
                else 
                {
                    alert("Erro ao salvar no servidor. Tente novamente.");
                }
            } 
            catch (erro) 
            {
                console.error(erro);
                alert("Erro de conexão com o servidor.");
            } 
            finally 
            {
                btnSalvar.innerText = textoOriginal;
                btnSalvar.disabled = false;
            }
        });
    }

    window.removerItemCarrinho = function(idProduto) 
    {
        let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];

        carrinho = carrinho.filter(item => item.id !== idProduto);

        localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));

        carregarCarrinho();     
        atualizarMenu();   
    };     
    
});

window.carregarDadosPerfil = function() 
{
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
      
    if (!usuario) 
    {
        alert("Você não está logado!");
        window.location.href = 'login.html';
        return;
    }

    const inputNome = document.getElementById('perfil-nome');
    const inputEmail = document.getElementById('perfil-email');
    const inputTelefone = document.getElementById('perfil-telefone');
    const inputEndereco = document.getElementById('perfil-endereco');

    if (inputNome) 
    {
        inputNome.value = usuario.nome_completo || usuario.nome;
        inputEmail.value = usuario.email;
        inputTelefone.value = usuario.telefone || '';
        inputEndereco.value = usuario.endereco || '';
    }
};

window.carregarMeusPedidos = async function() 
{
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const divLista = document.getElementById('lista-meus-pedidos');

    if (!usuario || !divLista)
    {
        return;
    }

    try 
    {
        const resposta = await fetch(`/pedidos/usuario/${usuario.id}`);
        const pedidos = await resposta.json();

        divLista.innerHTML = '';

        if (pedidos.length === 0) 
        {
            divLista.innerHTML = '<p>Você ainda não fez nenhum pedido. <br> <a href="cardapio.html">Fazer o primeiro!</a></p>';
            return;
        }

        pedidos.forEach(pedido => 
        {
            const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');
                
            let classeStatus = 'status-pendente';
            let icone = '⏳';
                
            if (pedido.status === 'PRONTO') { classeStatus = 'status-pronto'; icone = '✅'; }
            if (pedido.status === 'ENTREGUE') { classeStatus = 'status-entregue'; icone = '🚀'; }
            if (pedido.status === 'CANCELADO') { classeStatus = 'status-cancelado'; icone = '❌'; }

            const html = `
                <div class="pedido-historico">
                    <div>
                        <strong>Pedido #${pedido.id_pedido}</strong> <br>
                        <span style="font-size: 0.9rem; color: #666;">Data: ${dataFormatada}</span>
                    </div>
                    <div style="text-align: right;">
                        <span class="status-badge ${classeStatus}">
                            ${icone} ${pedido.status}
                        </span>
                        <div style="margin-top: 5px; font-weight: bold; color: #333;">
                            R$ ${pedido.valor_total}
                        </div>
                    </div>
                </div>
            `;
            divLista.innerHTML += html;
        });

    } 
    catch (erro) 
    {
        console.error(erro);
        divLista.innerHTML = '<p>Erro ao carregar seus pedidos.</p>';
    }
};