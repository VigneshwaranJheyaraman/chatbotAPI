//libraries
const express = require("express");
const constantsModule = require('./constants');
const bodyParser = require("body-parser");

//server application
var server = express();

//app configuration body parser
server.use(bodyParser.json());

server.get("/", (request, response) => {
    response.send(JSON.stringify({
        response: {
            data:{
                text:"Hi there"
            }
        }
    }));
});

server.post("/stopWords", (req, res) => {
    var givenSentence = req.body.sentence.replace(/[^a-zA-Z]/gi," ").toLowerCase();
    let nonStopWords = givenSentence.split(" ").filter((v) => {
        return constantsModule.neglectedKeywords.indexOf(v) === -1 && v !== "" && constantsModule.actionWords.indexOf(v) === -1;
    });
    nonStopWords = nonStopWords.filter((v,i) => {return nonStopWords.indexOf(v) === i});
    var actions = givenSentence.split(" ").filter((v,i) => {return constantsModule.actionWords.indexOf(v) !== -1 && v!== ""});
    var result = "";
    nonStopWords.forEach((v) => {
        if(constantsModule.actions[v] !== undefined)result += `${v} -> ${constantsModule.actions[v]}`+"\n";
    });
    actions.forEach((v) => {
        result += `${v} -> ${constantsModule.actions[v](nonStopWords[nonStopWords.length-1])}`
    });
    res.send(JSON.stringify({
        request:{
            data:{
                result:result
            }
        }
    }));
});





//server initiated
server.listen(constantsModule.constants.PORTNUMBER, (req, res) => {
    console.log("server started");
})
