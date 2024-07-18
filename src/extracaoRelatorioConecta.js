var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {
  extracao_relatorio: function (ctx, bot, enviaDocumento) {

    var sql_query = query.queryViradaRobo();

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this, enviaDocumento);
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

          retorno += "Não existe pedidos para serem autorizados!"
          bot.sendMessage(ctx.chat.id, "" + retorno);
        }
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          var header="EVENTO" + "\;" + "PROCESSO" + "\;" + "GV" + "\;" + "SETOR" + "\;" + "COD_GDN" + "\;" + "SEMAFORO" + "\;" + "SITUACAO_SETOR" + "\;" + "DATA_EFETIVACAO" + "\;" + "QT_PRE_PEDIDO" + "\;" + "DATA_LIMITE_AJUSTE" +  "\n"

          for (var i = 0; i < rows.length; i++) {
            retornoNovo += rows[i].EVENTO + '\;' 
            + rows[i].PROCESSO + '\;'
            + rows[i].GV + '\;' + rows[i].SETOR 
            + '\;' + rows[i].COD_GDN + '\;' 
            + rows[i].SEMAFORO + '\;' 
            + rows[i].SITUACAO_SETOR 
            + '\;' + moment(rows[i].DATA_EFETIVACAO).format('DD-MM-YYYY, HH:mm:ss')
            + '\;' + rows[i].QT_PRE_PEDIDO + '\;' 
            + moment(rows[i].DATA_LIMITE_AJUSTE).format('DD-MM-YYYY, HH:mm:ss') + '\n';

          }

          if (enviaDocumento) {
            var fs = require("fs");
            var file = 'robo_conecta.csv';
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