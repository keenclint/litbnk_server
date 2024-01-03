const express = require('express');
const cors =  require('cors'); 
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const {generateRandomString} = require('./random')
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



async function getUsers(){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find().toArray();
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 


async function patch(user,amount){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const findOneResult = await collection.updateOne(query,{$set:{"balance":amount, "deposits":amount}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with new price ${amount} .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}

async function getDashBoard(_username){
    const uri = process.env.uri;
    
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Dashboard";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const findOneQuery = { username: _username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      console.log(
        `Couldn't find any package that contain ${_username} as an name.\n`
      );
    } else {
      console.log(`Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(findOneResult) }\n`)
      return(JSON.stringify(findOneResult))
      ;
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close(); 
}   

async function login(username,password) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneQuery = { username: username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult !== null) {
      if (findOneResult.password === password) {
        await client.close();
        return true;

      } else {
        await client.close();
        return false;
      }
    } else {
      await client.close();
      return false;
      
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one user: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}


async function register(_username, _password, _country, _email, _address, _mobile, _first, _last, _maiden) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Users";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const dashboard_collection = database.collection("Dashboard");

  const acc_number = generateRandomString();
  const user = {
    username: _username,
    password: _password,
    country: _country,
    email: _email,
    address: _address,
    mobile: _mobile,
    first_name: _first,
    last_name: _last,
    maiden_name: _maiden,
    acc_num : acc_number
  };

  const dashboard = {
    account: acc_number, // should be 15
    balance : 0,
    deposits: 0,
    transactions: 0,
    fdr: 0,
    dps: 0,
    loan: 0,
    username: _username,
    withdrawals:0
  }


  try {
    const insertOneUser = await user_collection.insertOne(user);
    const insertManyDashboard = await dashboard_collection.insertOne(dashboard);
    //console.log(`${user.username} successfully inserted.\n`);
    console.log(`${dashboard.account} successfully inserted.\n`);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function root(username,password) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Users";
  const collectionName = "Admins";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneQuery = { username: username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult !== null) {
      if (findOneResult.password === password) {
        await client.close();
        return true;

      } else {
        await client.close();
        return false;
      }
    } else {
      await client.close();
      return false;
      
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one user: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}





app.get('/dashboard/:user', (req,res)=>{
    async function getMyDashboard(){
        const { user } = req.params;
        const data = await getDashBoard(user);
        res.send({data:data})
    }getMyDashboard()
})

app.post('/register',(req,res)=>{
  async function create_account() {
    console.log(req.body)
    const { username, password, country, email, address, mobile,first_name,last_name,maiden_name } = req.body;
    const success = await register(username,password,country,email,address,mobile,first_name,last_name,maiden_name);
    if (success) {
        res.send(success)
    }else{
      res.status(400).send("unable to save to database");
      }
  } create_account()
})


app.post("/login", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, password } = req.body;
    const response = await login(username, password)
    if(response){
      res.send(response)
    }else{
    res.status(400).send("wrong username or password");
    }
  }approve()
})

app.post("/root", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, password } = req.body;
    const response = await root(username, password)
    if(response){
      res.send(response)
    }else{
    res.status(400).send("wrong username or password");
    }
  }approve()
})


app.get('/users', (req,res)=>{
  async function getMyUsers(){
      const data = await getUsers();
      res.send({data:data})
  }getMyUsers()
})


app.post("/update", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { user, amount } = req.body;
    const response = await patch(user,amount)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})

const port = 8000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}!.`)
})
