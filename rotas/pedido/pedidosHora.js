var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var enviarMensagens = require('../../tools/enviarMensagens');
var pedidoshora = require('../../src/pedidoshora.js');

// /pedidos_hora - Listar quantidade de pedidos por hora (no dia atual)
bot.onText(/\/pedidos_hora/, async (ctx, match) => {
    const chatId = ctx.chat.id;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    if (autorizado) {
        enviarMensagens.enviarMensagemDeEspera(ctx)
        await pedidoshora.pedidos_hora(ctx, bot, true, false, 1 )
        await funcoes.sleep(2000);
        await pedidoshora.pedidos_hora(ctx, bot, true, false, 0 )
        await funcoes.sleep(5000);
        await pedidoshora.pedidos_hora(ctx, bot, false, true, '1,0' )
    } else {
        funcoes.autorizacaoNegada(ctx);
    }
});