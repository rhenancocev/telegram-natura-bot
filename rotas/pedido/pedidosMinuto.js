var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var enviarMensagens = require('../../tools/enviarMensagens');
var pedidosminuto = require('../../src/pedidosminuto.js');

// /pedidos_minuto - Listar quantidade de pedidos por minuto no range de 1 hora
bot.onText(/\/pedidos_minuto/, async (ctx, match) => {
    const chatId = ctx.chat.id;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    if (autorizado) {
        enviarMensagens.enviarMensagemDeEspera(ctx)
        await pedidosminuto.pedidos_minuto(ctx, bot, true, false, 1 )
        await funcoes.sleep(2000);
        await pedidosminuto.pedidos_minuto(ctx, bot, true, false, 0 )
        await funcoes.sleep(5000);
        await pedidosminuto.pedidos_minuto(ctx, bot, false, true, '1,0' )
    } else {
        funcoes.autorizacaoNegada(ctx);
    }
});