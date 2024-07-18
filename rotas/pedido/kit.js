var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var composicaoKit = require('../../src/composicaoKit')

//serviço para consultar a composição de um KIT
bot.onText(/\/kit/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var nm_kit = texto.substring(5);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/kit";
    const y = "Cód KIT PAI";

    if (validacaoTexto[0] === '/kit') {
        if (nm_kit === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {

            if (!funcoes.isNumber(nm_kit)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, nm_kit, y);
            } else if (autorizado) {
                composicaoKit.composicao_kit(ctx, bot, nm_kit);
                //funcoes.manutencao(ctx);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }
});
