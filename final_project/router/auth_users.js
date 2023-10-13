const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
console.log(username, password);
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auths/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.session.authorization['username'];

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized111' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Check if the user has already posted a review for this book
  if (books[isbn].reviews[username]) {
    // Modify the existing review
    books[isbn].reviews[username] = review;
  } else {
    // Add a new review for the user
    books[isbn].reviews[username] = review;
  }

  res.status(200).json({ message: 'Review submitted or modified successfully' });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    // Use the 'delete' operator to remove the review for the specified user
    
    delete books[isbn].reviews[username];
    res.status(200).json({ message: 'Review deleted successfully' });
  } else {
    res.status(404).json({ message: 'Review not found' });
  } 
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
