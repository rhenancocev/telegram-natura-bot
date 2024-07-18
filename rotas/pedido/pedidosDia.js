var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var enviarMensagens = require('../../tools/enviarMensagens');
var pedidosdia = require('../../src/pedidosdia.js');

// /pedidos_dia - Listar quantidade de pedidos dos últimos 10 dias
bot.onText(/\/pedidos_dia/, async (ctx, match) => {
    const chatId = ctx.chat.id;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    if (autorizado) {
        enviarMensagens.enviarMensagemDeEspera(ctx)
        await pedidosdia.pedidos_dia(ctx, bot, true, false, 1 )
        await funcoes.sleep(2000);
        await pedidosdia.pedidos_dia(ctx, bot, true, false, 0 )
        await funcoes.sleep(5000);
        await pedidosdia.pedidos_dia(ctx, bot, false, true, '1,0' )
    } else {
        funcoes.autorizacaoNegada(ctx);
    }
});