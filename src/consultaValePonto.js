var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {


  consulta_vale_ponto: function (ctx, bot, param) {

    var sql_query = query.queryConsultaValePonto(param);

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this);

  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot) {
    resultSet.getRows(
      numRows,  // get this many rows


      function (err, rows) {
        var retornoCD_CONSULTORA                   = "";
        var retornoCD_PROMOCAO                     = "";
        var retornoNO_PROMOCAO                     = "";
        var retornoVL_QUANTIDADE_REQUISITO         = "";
        var retornoQT_LIMITE_USO_STEP              = "";
        var retornoQT_VALE_PONTO                   = "";
        var retornoLIMITE_CICLO                    = "";
        var retornoCLICLO="";
        const texto = ctx.text;
        var consultora = texto.substring(12);

        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0){
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
          bot.sendMessage(ctx.chat.id, "A consultora: " + "<b>" + consultora + "</b>" + ", não possui nenhum VP para ser resgatado!", {parse_mode: "HTML"});
        } 
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
            retornoCD_CONSULTORA            += rows[0].CD_CONSULTORA 

          for (var i = 0; i < rows.length; i++) {
            
            retornoCD_PROMOCAO              += rows[i].CD_PROMOCAO + " - " + rows[i].NO_PROMOCAO + "\n";
            retornoVL_QUANTIDADE_REQUISITO  += "\n" + "Referente a promo " + rows[i].CD_PROMOCAO + ', o requisito da promo é: ' + rows[i].VL_QUANTIDADE_REQUISITO + " Pontos.";
            retornoQT_LIMITE_USO_STEP       += "\n" + "Referente a promo: " + rows[i].CD_PROMOCAO + ', o limite de uso é: ' + rows[i].QT_LIMITE_USO_STEP + " Vale Ponto(s)";
            retornoQT_VALE_PONTO            += "\n" + "Referente a promo: " + rows[i].CD_PROMOCAO + ', a quantidade utilizada é: ' + rows[i].QT_VALE_PONTO + " Vale Ponto(s)";
            retornoLIMITE_CICLO             += "\n" + "Referente a promo: " + rows[i].CD_PROMOCAO + ', a quantidade disponivel é: ' + rows[i].LIMITE_CICLO + " Vale Ponto(s)";
            retornoCLICLO                   += "\n" + "Referente a promo: " + rows[i].CD_PROMOCAO + ', o limite de resgate é até o ciclo: ' + rows[i].CICLO;
          }
            

          bot.sendMessage(ctx.chat.id, "Consultora: " + "<b>" + retornoCD_CONSULTORA + "</b>"
                                     + "\n\nCód da promoção: " + "<b>" + retornoCD_PROMOCAO + "</b>"
                                     + "\n\nRequisito da promoção: " + "<b>" + retornoVL_QUANTIDADE_REQUISITO + "</b>"
                                     + "\n\nLimite de uso do VP: " + "<b>" + retornoQT_LIMITE_USO_STEP + "</b>"
                                     + "\n\nQuantidade de VP utilizada: " + "<b>" + retornoQT_VALE_PONTO + "</b>"
                                     + "\n\nQuantidade disponível de VP: " + "<b>" + retornoLIMITE_CICLO + "</b>"
                                     + "\n\nCiclo limite para resgate: " + "<b>" + retornoCLICLO + "</b>"
                                     , { parse_mode: "HTML" });

          if (rows.length === numRows)      // might be more rows
            fetchRowsFromRS(connection, resultSet, numRows);
          else
            doClose(connection, resultSet); // always close the ResultSet
        } else { // no rows
          doClose(connection, resultSet);   // always close the ResultSet
        }
      });
  }

};

//Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}

function doClose(connection, resultSet) {
  resultSet.close(
    function (err) {
      if (err) { console.error(err.message); }
      doRelease(connection);
    });
}