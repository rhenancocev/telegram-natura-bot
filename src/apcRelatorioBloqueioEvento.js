var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {
  extracao_relatorio: function (ctx, bot, enviaDocumento) {

    var sql_query = query.queryExtracaoBloqueioEvento();

    sqlutil.executar_sql_o73pr(sql_query, ctx, bot, this, enviaDocumento);
  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot, enviaDocumento) {
    resultSet.getRows(
      numRows,  // get this many rows

      function (err, rows) {
        var chatId = ctx.chat.id;

        var retorno = "";
        var retornoNovo = "";

        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          retorno += "Não existe dados para extração do relatorio"
          bot.sendMessage(ctx.chat.id, "" + retorno);
        }
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          var header="Adiantamento" + "\;" + "Capa_Lote" + "\;" + "Data_Solicitacao" + "\;" + "Matricula" + "\;" + "Valor" + "\;" + "Finalidade" + "\;" + "Setor" + "\;" + "Centro_de_Custo" + "\;" + "Tipo" + "\;" + "Ciclo" +  "\;" + "Sit" + "\;" + "Data_referência_(Aprov/Reprov)" + "\;" + "Situacao_do_adiantamento" + "\;" + "Sit2" + "\;" + "Situacao_da_Capa_Lote" + "\;" + "Situacao_do_Processo" + "\;" + "Aging" + "\n"

          for (var i = 0; i < rows.length; i++) {
            retornoNovo += rows[i].ID + '\;' 
            + rows[i].CAPA_LOTE + '\;'
            + rows[i].DATA_SOLICITACAO + '\;' 
            + rows[i].MATRICULA + '\;'
            + rows[i].VALOR + '\;' 

            + rows[i].SETOR + '\;' 
            + rows[i].CENTRO_DE_CUSTO + '\;' 
            + rows[i].TIPO + '\;' 
            + rows[i].CICLO + '\;' 
            + rows[i].SIT + '\;' 
            + moment(rows[i].DATA_REFERENCIA).format('DD-MM-YYYY, HH:mm:ss') + '\;'
            + rows[i].SITUACAO_ADIANTAMENTO + '\;' 
            + rows[i].SIT2 + '\;' 
            + rows[i].SITUACAO_CAPA_LOTE + '\;' 
            + rows[i].SITUACAO_DO_PROCESSO + '\;' 
            + rows[i].AGING + '\;' 
          }

          if (enviaDocumento) {
            var fs = require("fs");
            var file = 'relatorio_bloq_evento.csv';
            var data = header+retornoNovo;
            const encoding = 'utf8';

            const callback = (err) => {
              if (err) throw err
            }

            fs.writeFileSync(file, data, encoding, callback)

          }

          bot.sendDocument(chatId, file);

          if (rows.length == numRows)      // might be more rows
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