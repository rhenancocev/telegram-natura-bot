var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {


    segmento_Parcelamento_Boleto: function (ctx, bot, param) {

    var sql_query = query.querySegmentacaoParcelamentoBoleto(param);

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this);

  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot) {
    resultSet.getRows(
      numRows,  // get this many rows


      function (err, rows) {
        var retorno                 = "";
        var retornoCdPessoa         = "";
        var retornoGrupoSegmento    = "";
        var retornoDataInicioPartc  = "";
        var retornoDataFimPartc     = "";
        var retornoDataAtualizacao  = "";
        var retornoSegmento         = "";

        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0){
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
          retorno += "A consultora não está dentro dos grupos segmento:" + "\n\n" + "200223001 - Parcelamento Boleto/Cartão PERFUMARIA " + "\n" + "200265001 - Parcelamento Boleto/Cartão";
          bot.sendMessage(ctx.chat.id, "" + retorno);
        } 
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          
          retorno = "Grupos segmento na qual a consultora pode ter: " +
                    "\n\n 200223001 - Parcelamento Boleto/Cartão PERFUMARIA. " +
                    "\n 200265001 - Parcelamento Boleto/Cartão." +
                    "\n 200417001 - Box Capta 5% de desconto.";

          retornoCdPessoa         += rows[0].CD_PESSOA;

          for (var i = 0; i < rows.length; i++) {
           
            retornoGrupoSegmento    += rows[i].GRUPO_SEGMENTO + "\n";
            retornoDataInicioPartc  += rows[i].SEGMENTO + "\nData: " + moment(rows[i].DT_INICIO_PARTICIPACAO).format('DD-MM-YYYY') + "\n\n";
            retornoDataFimPartc     += rows[i].SEGMENTO + "\nData: " + moment(rows[i].DT_FIM_PARTICIPACAO).format('DD-MM-YYYY') + "\n\n";
            retornoDataAtualizacao  += rows[i].SEGMENTO + "\nData: " + moment(rows[i].DT_ATUALIZACAO).format('DD-MM-YYYY  HH:MM:SS a') + "\n\n";

          }

          //console.log('Numero do Pedido: ' + retorno);
          bot.sendMessage(ctx.chat.id, retorno
                                     + "\n\nCódigo da CN: " + "<b>" + retornoCdPessoa + "</b>"
                                     + "\n\nGrupo Segmento: " + "<b>" + retornoGrupoSegmento + "</b>"
                                     + "\n\nData inicio da participação: " + "<b>" + retornoDataInicioPartc + "</b>"
                                     + "\n\nData fim da participação: " + "<b>" + retornoDataFimPartc + "</b>"
                                     + "\n\nData atualização tabela: " + "<b>" + retornoDataAtualizacao + "</b>", { parse_mode: "HTML" });

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