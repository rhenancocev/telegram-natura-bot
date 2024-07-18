var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var extracao = require('../../src/extracaoRelatorioConecta');
var enviarMensagens = require('../../tools/enviarMensagens');

//extração de relatorio para a estrategia do conecta
bot.onText(/\/robo/, (ctx, match) => {
    const chatId = ctx.chat.id;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);

            if (autorizado) {
                enviarMensagens.enviarMensagemDeEsperaRelatorio(ctx)
                extracao.extracao_relatorio(ctx, bot, true);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
});