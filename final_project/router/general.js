const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
console.log(username, password);
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop
public_users.get('/', function (req, res)  {
  // return res.send(books);
  let data= new Promise((resolve, reject) => {
    // Simulate fetching data (e.g., from a database)
    // Replace this with your actual data retrieval logic
    setTimeout(() => {
      const booksList = books;
      resolve(booksList);
    
    }, 1000); // Simulated delay of 1 second
  });
   
  data.then((successMessage)=>{
    const booksList=  JSON.stringify (successMessage,null,4);
   return res.send(booksList);});
  // return res.status(401).json({message: "something erro"});
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isb=req.params.isbn;
  const bookList=await JSON.stringify(books[isb],null,4); 
  return res.send(bookList);
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const authDetail = await Object.values(books).filter((e) => {
     return e.author == author; // Use 'return' to filter the results
   });

  return res.send(JSON.stringify(authDetail, null, 4));
});


// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const titleDetail =await Object.values(books).filter((e) => {
     return e.title == title; // Use 'return' to filter the results
   });

  return res.send(JSON.stringify(titleDetail, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   
  const isb=req.params.isbn;
  
  const titleDetail = Object.values(books[isb]);
  return res.send(JSON.stringify(titleDetail.title,null,4));
  // return res.status(300).json({message: "Yet to be implemented"});
 });

module.exports.general = public_users;
