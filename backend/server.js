const express =require('express');
const app=express();

const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const todoRoutes=express.Router();
const PORT=4000;

let Todo=require('./todo.model');


app.use(cors());
app.use(bodyParser.json());

//to connection mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/todos',{ useNewUrlParser:true})
const connection=mongoose.connection;

connection.once('open',function(){
    console.log("mongoDB database connection stablished successfully!!")
})

todoRoutes.route('/').get(function(req,res){
    Todo.find(function(err,todos){
        if (err) {
            console.log(err)    
        }else{
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req,res){
    let id=req.params.id;
    Todo.findById(id,function(err,todo){
        res.json(todo);
    })
})

todoRoutes.route('/add').post(function(req,res){
    let todo=new Todo(req.body);
    todo.save()
    .then(todo=>{
        res.status(200).json({'todo':'todo added successfully'})
    })
    .catch(err=>{
        res.status(400).send('adding new todo failed');
    })
})

todoRoutes.route('/update/:id').post(function(req,res){
    Todo.findById(req.params.id,function(err,todo){
        if (!todo) {
            res.status(404).send('data is not found')
        }else{
            todo.todo_description=req.body.todo_description;
            todo.todo_responsible=req.body.todo_responsible;
            todo.todo_priority=req.body.todo_priority;
            todo.todo_completed=req.body.todo_completed;

            todo.save().then(todo=>{
                res.json('Todo updated')
            })
            .catch(err=>{
                res.status(400).send('update not possible');
            })
        }

    })
})

todoRoutes.route('/delete/:id').delete(function(req,res){
    console.log(req.params.id);
    Todo.findByIdAndRemove(req.params.id,function(err,response){
        if (err) {
            res.json('some error occured!! Please try again')
        }else{
            res.json({message:'todo with id '+req.params.id+' deleted!!'});
        }
    })
})

app.use('/todos',todoRoutes);

app.listen(PORT,function(){
    console.log("server is running on port: "+PORT); 
})