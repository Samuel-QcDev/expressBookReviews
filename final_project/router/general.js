const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session')

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
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books))
  //return res.status(300).json({message: JSON.stringify(books)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn])
  //return res.status(300).json(JSON.stringify(isbn));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const keys = Object.entries(books)
    var filtered_books = new Array
    var flag = 0
    var pos = 0  
    for (let i=1;i<11;i++){
        if (books[i].author === author){
            filtered_books[pos] = books[i]
            flag = 1
            pos = pos = pos + 1
        }
    }
    if(flag==1){
        res.send(filtered_books)
    }
    else{
        res.send("No books found for this author")
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    var filtered_books_title = new Array
    let flag = 0
    let pos = 0  
    for (let i=1;i<11;i++){
        if (books[i].title === title){
            filtered_books_title[pos] = books[i]
            flag = 1
            pos = pos = pos + 1
        }
    }
    if(flag==1){
        res.send(filtered_books_title)
    }
    else{
        res.send("No books found for this title")
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
    res.send(books[isbn].reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
