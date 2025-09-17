import { log } from 'console';
import express from 'express'
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';
import { title } from 'process';

const app=express();
const publicPath=path.resolve('public')


app.set("view engine",'ejs')
app.use(express.static(publicPath))
app.use(express.urlencoded({extended:true}))

//DATABASE
const dbname='node-project'
const url='mongodb://localhost:27017'
const client= new MongoClient(url);

client.connect().then((connection)=>{
    const db=connection.db(dbname)
    let collect='todo'

    app.get('/', async (req,res)=>{
        const collection = db.collection(collect)
        const result = await collection.find().toArray();
       // console.log(result);
        
    res.render('list',{result})
})
app.get('/add',(req,res)=>{
    res.render('add')
})
app.get('/update',(req,res)=>{
    res.render('update')

})
app.post('/add',async (req,res)=>{
    const collection=db.collection(collect)
    const result =await collection.insertOne(req.body)
    if(result){
        res.redirect('/');
    }
    else{
        res.redirect('/add');
    }
})
app.post('/update',(req,res)=>{
    res.redirect('/')
})


// Delete items 
app.get('/delete/:id',async (req,res)=>{
    const collection=db.collection(collect)
    const result =await collection.deleteOne({_id:new ObjectId(req.params.id)})

    if(result){
        res.redirect('/');
    }
    else{
        res.send("Some Error");
    }
})

//Delete Many Items
app.post('/multi-delete',async (req,res)=>{
    const collection=db.collection(collect)
    console.log(req.body.selectedtask);
    let selectedtask=undefined
    if(Array.isArray(req.body.selectedtask)){
      selectedtask=req.body.selectedtask.map((id)=> new     ObjectId(id))
    }
    else{
        selectedtask=[new ObjectId(req.body.selectedtask)]
    }
    console.log(selectedtask);

    const result =await collection.deleteMany({_id:{$in:selectedtask}})

    if(result){
        res.redirect('/');
    }
    else{
        res.send("Some Error");
    }
})


//Update Item
app.get('/update/:id',async (req,res)=>{
    const collection=db.collection(collect)
    const result =await collection.findOne({_id:new ObjectId(req.params.id)})
    //console.log(result);  
    if(result){
        res.render('update',{result});
    }
    else{
        res.send("Some Error");
    }
})
app.post('/update/:id',async (req,res)=>{
    const collection=db.collection(collect)
    const filter={_id:new ObjectId(req.params.id)}
    const update= {$set:{title:req.body.title,description:req.body.description}}
    const result =await collection.updateOne(filter,update)
    //console.log(result);  
    if(result){
        res.redirect('/');
    }
    else{
        res.send("Some Error");
    }
})
})


app.listen(3300)
