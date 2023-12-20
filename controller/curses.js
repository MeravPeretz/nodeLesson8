const { Router } = require('express');
const app = Router();
const fs = require('fs').promises;
let curses;
let Curses = async function() {
    curses = await fs.readFile('./data/curses.json');
    curses = await JSON.parse(curses)
    app.get('/curse/:curseId', (req, res) => {
        const id = Number(req.params.curseId)
        const curse = curses.find(curse => Number(curse.id) === id);
        if (!curse) {
            res.status(404);
            res.send("CURSE NOT FOUND");
        }
        res.json(curse);
    });
    app.get('/curses', (req, res) => {
        res.json(curses);
    });
    app.put("/curse/:id",(req,res)=>{
        let id=req.params.id;
        let exist=-1;
        for(i=0;i<curses.length;i++){
            if(curses[i].id==id){
                curses[i]=req.body;
                exist=i;
            }
        }
        if(exist==-1){
            res.status(404);
            res.send("CURSE NOT FOUND");
        }
        fs.writeFile("./data/curses.json", JSON.stringify(curses));
         res.send("data updated:"+JSON.stringify(curses[exist]));        
    })
    app.delete("/curse/:id",(req,res)=>{
        let id=req.params.id;
        let exists=false
        for(i=0;i<curses.length;i++){
            if(curses[i].id===id){
                curses.splice(i,1);
                exists=true;
            }
        }
        if(!exists){
            res.status(404);
            res.send("CURSE NOT FOUND");
        }
        fs.writeFile("./data/curses.json", JSON.stringify(curses));
         res.send("curse removed");        
    })
    app.post('/curse', (req, res) => {
        let exists=false;
        for(i=0;i<curses.length;i++){
            if(curses[i].id===req.body.id){
                exists=true;
            }
        }
        if(exists){
            res.send("It is not possible to add an existing curse");
        }
        else{
            curses.push(req.body);
            fs.writeFile("./data/workers.json", JSON.stringify(curses));
            res.send('Data Received: ' + JSON.stringify(req.body));
        }
    });
}
Curses();
module.exports = app;