var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {


  composicao_kit: function (ctx, bot, param) {

    var sql_query = query.queryComposicaoKit(param);

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this);

  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot) {
    resultSet.getRows(
      numRows,  // get this many rows


      function (err, rows) {
        var retornoCodVendaPai                          = "";
        var retornoCodVendaFilho                        = "";
        const texto = ctx.text;
        var kit = texto.substring(5);

        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0){
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
          bot.sendMessage(ctx.chat.id, "O KIT PAI " + "<b>" + kit + "</b>" + ", não existe no nosso banco de dados!", {parse_mode: "HTML"});
        } 
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
            retornoCodVendaPai += "\n" + rows[0].COD_VENDA_PAI  + ' - ' + rows[0].DC_PRODUTO_PAI + ".\nPontução: " + rows[0].PONTUCAO_KIT 
                                  + " Pts.\nValor do Kit: R$ " + rows[0].PRECO_KIT;

          for (var i = 0; i < rows.length; i++) {
            

            retornoCodVendaFilho += "\n" + rows[i].COD_VENDA_FILHO + ' - ' + rows[i].DC_PRODUTO_FILHO + ' - ' + rows[i].QT_KIT + ' unidade.' + '\n';

          }

          bot.sendMessage(ctx.chat.id, "Código de venda PAI: \n" + "<b>" + retornoCodVendaPai + "</b>"
                                     + "\n\nComposição do KIT: \n" + "<b>" + retornoCodVendaFilho + "</b>"
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