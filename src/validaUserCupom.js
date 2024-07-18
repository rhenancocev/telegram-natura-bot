var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');
var apiCupom = require('./apiCupom');

module.exports = {


  cupom: function (ctx, bot, param) {

    var sql_query = query.queryValidaCupom(param);

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this);

  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot) {
    resultSet.getRows(
      numRows,  // get this many rows


      function (err, rows) {
        var retornoPessoa = "";

        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0){
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          const texto = ctx.text;
          var CN = texto.substring(7);
          
          bot.sendMessage(ctx.chat.id, "A consultora " + "<b>"+CN+"</b>" + " não captou o <b>KIT DESEJO</b> ou o código CN está errado!",{ parse_mode: "HTML" });
        } 
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          //for feito para rodar massivamente varias consultoras, não da pra testar mas espero que funcione
          for (var i = 0; i < rows.length; i++) {
            apiCupom.apiCupom(ctx,bot, rows[i].CPF, rows[i].CN);
          }
          
            //retornoPessoa += rows[0].CPF;
            //apiCupom.apiCupom(ctx,bot,retornoPessoa);

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