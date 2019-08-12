var express = require('express');
var path = require('path');
require('dotenv').config();

var app = express();
app.set('view engine','html');
app.use(express.static(path.join(__dirname, 'docs')));

app.get("*",function(req, res){
    res.sendFile('docs/index.html');
});

app.listen(process.env.DOCS_PORT,function(){
    console.log(`Docs Server Started Running on ${process.env.DOCS_PORT}`);
});