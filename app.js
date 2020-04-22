const express = require('express');
const employeelist = require('./myjsonfiles/employee.json');
// const todolist = require('./myjsonfiles/todolist.json');

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true })

let employeeDb;
let todolistCollection;

// this function connects the the mongodb
const newConn = async () => {
    await client.connect();
    employeeDb = client.db('employeedb');
    todolistCollection = employeeDb.collection('todo');
    
} 
newConn();

const createTodo = async (data) => {
    try {
        const result = await todolistCollection.insertOne(data);
        return result;

    } catch (error) {
        console.log(error)
    }
}

const getAllTodo = async () => {
    try {
        const result = await todolistCollection.find({}).toArray();
        return result;
    } catch (error) {
        console.log(error)
    }
} 


const app = express()

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res)=>{
    res.render('home')
});

app.get('/employeeList', (req, res)=>{
    res.render('employees', {
        employeelist
    })
});

app.get('/todoList', async (req, res)=>{
    const todolist = await getAllTodo();
    res.render('todolist', {
        todolist: todolist.reverse()
    })
})

app.post('/upload', async (req, res) => {
    const data = {
        activity: req.body.activity,
        status: req.body.status
    }
    const result = await createTodo(data);
    res.redirect('/todoList')
});

const port = 6600;
app.listen(port, ()=>{
    console.log(`My application is listening on port ${port}...`);
});