const { Router } = require('express');
const app = Router();
const fs = require('fs').promises;
let workers;
let getWorkers = async function () {
    workers = await fs.readFile('./data/workers.json');
    workers = await JSON.parse(workers)
    app.get('/worker/:workerId', (req, res) => {
        const id = Number(req.params.workerId)
        const worker = workers.find(worker => worker.id === id)
        if (!worker) {
            res.status(404);
            res.send("WORKER NOT FOUND");
        }
        res.json(worker);
    });
    app.get('/workers', (req, res) => {
        let workers1 = workers;
        const job = req.query.job;
        const department = req.query.department;
        const dateOfBegin = req.query.dateOfBegin;
        if (job != null) {
            workers1 = workers1.filter(worker => worker.job.toLowerCase().includes(job.toLowerCase()))
        }
        if (department != null) {
            workers1 = workers1.filter(worker => worker.department.toLowerCase().includes(department.toLowerCase()))
        }
        if (dateOfBegin != null) {
            workers1 = workers1.filter(worker => new Date(worker.dateOfBegin) >= new Date(dateOfBegin))
        }
        if(workers1!=[])
            res.json(workers1);
        else{
            res.status(404);
            res.send("There are no employees with these conditions");
        }
    });
    app.put("/worker/:id",(req,res)=>{
        let id=req.params.id;
        let exists=-1;
        for(i=0;i<workers.length;i++){
            if(workers[i].id===id){
                workers[i]=req.body;
                exists=i;
            }
        }
        if(exists==-1){
            res.status(404);
            res.send("WORKER NOT FOUND");
        }  
        fs.writeFile("./data/workers.json", JSON.stringify(workers));
        res.send("data updated:"+workers[exists]); 
    })
    app.delete("/worker/:id",(req,res)=>{
        let id=req.params.id;
        let exists=false;
        for(i=0;i<workers.length;i++){
            if(workers[i].id===id){
                workers.splice(i,1);
                exists=true;
            }
        }
        if(!exists){
            res.status(404);
            res.send("WORKER NOT FOUND");
        }
        fs.writeFile("./data/workers.json", JSON.stringify(workers));
         res.send("worker removed");        
    })
    app.post('/worker', (req, res) => {
        let exists=false;
        for(i=0;i<workers.length;i++){
            if(workers[i].id===req.body.id){
                exists=true;
            }
        }
        if(exists){
            res.send("It is not possible to add an existing employee");
        }
        else{
            workers.push(req.body);
            fs.writeFile("./data/workers.json", JSON.stringify(workers));
            res.send('Data Received: ' + JSON.stringify(req.body));
        }
    });
}
getWorkers();
module.exports = app;