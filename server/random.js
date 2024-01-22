const { MongoClient } = require("mongodb");
require('dotenv').config()


function generateRandomString() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomString += letters.charAt(randomIndex);
  }

  // Generate 13 random numbers
  for (let i = 0; i < 13; i++) {
    randomString += Math.floor(Math.random() * 10);
  }

  return randomString.toUpperCase();
}

async function credit(_username, _amount,date) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Credits";
  const database = client.db(dbName);
  const tx_collection = database.collection(collectionName);
  const Transactions_collection = database.collection("Transactions")

  const sn = generateRandomString()
  const tx = generateRandomString()
  const txs = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
  };
  const transactions = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
    type: "credit",
    date: date, 
    category: "Intra Bank",
    receiptient: generateRandomString()
  }
  try {
    const insertOneUser = await tx_collection.insertOne(txs);
    const insertTransactions = await Transactions_collection.insertOne(transactions);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}

async function debit(_username, _amount, date) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Debits";
  const database = client.db(dbName);
  const tx_collection = database.collection(collectionName);
  const Transactions_collection = database.collection("Transactions")

  const sn = generateRandomString()
  const tx = generateRandomString()
  const txs = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
  };
  const transactions = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
    date: date, 
    type: "debit",
    category: "Intra Bank",
    receiptient: generateRandomString()
  }
  try {
    const insertOneUser = await tx_collection.insertOne(txs);
    const insertTransactions = await Transactions_collection.insertOne(transactions);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function getCredits(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Credits";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
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

async function getIntraBeneficiaries(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Beneficiaries";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
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

async function getInterBeneficiaries(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "OutsideBeneficiaries";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
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



async function getDebits(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Debits";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
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


async function patch_withdraw(user,amount){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}

  try {
    const findOneResult = await collection.updateOne(query,{$set:{"withdrawals":amount}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with new price ${amount} .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}

async function getAllDashboard(){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Dashboard";
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


async function getTransactions(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Transactions";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const documents = await collection.find(query).toArray()
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


async function getUser(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}  
  try {
    const documents = await collection.findOne(query);
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

async function create_bene(username,account_name,account_number,short_name ) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "Beneficiaries";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const user = {
    username: username,
    short_name: short_name,
    account_name: account_name,
    account_number : account_number
  };

  try {
    const insertOneUser = await user_collection.insertOne(user);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function create_other_bene(username,bank_name,sort_code,routing_number,account_name,account_number,short_name ) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "Bankers";
  const collectionName = "OutsideBeneficiaries";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const user = {
    username: username,
    bank_name:bank_name,
    sort_code:sort_code,
    routing_number:routing_number,
    short_name: short_name,
    account_name: account_name,
    account_number : account_number
  };

  try {
    const insertOneUser = await user_collection.insertOne(user);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}



module.exports = {
  generateRandomString,
  credit,
  debit,
  getCredits,
  getDebits,
  patch_withdraw,
  getAllDashboard,
  getTransactions,
  getUser,
  create_bene,
  create_other_bene,
  getIntraBeneficiaries,
  getInterBeneficiaries,
};