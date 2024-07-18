var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var pontuacao = require('../../src/pontuacao');


// /pts - mostra a relacao de pontos que a CN tem disponivel
bot.onText(/\/pts/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var cd_consultora = texto.substring(4);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/pts";
    const y = "cód da consultora";
    const z = "cód de CN";

    if (validacaoTexto[0] === '/pts') {
        if (cd_consultora === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(cd_consultora)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, cd_consultora, z);
            } else if (autorizado) {
                pontuacao.pontuacao_disponivel(ctx, bot, cd_consultora);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }
});
