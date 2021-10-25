var express = require("express");
var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const { render } = require("ejs");
const Resposta = require("./database/Resposta");
const { response } = require("express");



connection.authenticate()
    .then(() => {
        console.log("abriu o banco normal")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })


app.get("/", function (req, res) {
    Pergunta.findAll({
        raw: true, order: [['id', 'DESC']
        ]
    }).then(perguntas => {
        console.log(perguntas);
        res.render("index", {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", function (req, res) {

    res.render("perguntar");
});

app.post("/salvarpergunta", function (req, res) {
    var descricao = req.body.descricão;
    var titulo = req.body.titulo;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");

    });
});

app.get("/pergunta/:id", function (req, res) {
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }

    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [["id", "DESC"]]

            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect("/");
        }
    });
});

app.post("/responder", function (req, res) {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(400, function (erro) {
    if (erro) {

        console.log("Deu erro");
    } else {
        console.log("abriu servidor");
    }

})

