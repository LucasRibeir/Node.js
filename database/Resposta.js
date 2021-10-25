var connection = require("./database");
var Sequelize = require ("sequelize");
const { text } = require("body-parser");

const Resposta = connection.define("respostas",{
corpo:{
    type:Sequelize.TEXT,
    allowNull: false

},
perguntaId:{                      
type: Sequelize.INTEGER,
allowNull:false



}});

Resposta.sync({force:false}).then(() =>{});

module.exports=Resposta;