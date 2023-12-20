const express = require('express');
const bodyParser = require('body-parser' );

const worker = require('./controller/workers.js');
const curse = require('./controller/curses.js');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}));

app.use(worker);
app.use(curse);

app.get("*", (req, res) => {
    res.status(404);
    res.send("PAGE NOT FOUND");
});

app.use((err, req, res, next)=> {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.send("there is an error in the server now,try later")
});

app.listen(3000, () => {
 
})