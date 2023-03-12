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
  
  const getBookByAsync = async({isbn, author, title}) => {
    return new Promise((resolve, reject) => {
      var book;
      if (isbn) {
        book = books[isbn];
      } else if (author) {
        for (let key in books) {
          if (books[key].author === author) {
            book = books[key];
            break;
          }
        }
      } else if (title) {
        for (let key in books) {
          if (books[key].title === title) {
            book = books[key];
            break;
          }
        }
      }
      resolve(book);
    });
  }

  const getBooksAsync = async() => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBookByAsync().then((books) => res.json(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getBookByAsync({isbn: req.params.isbn}).then((book) => {
    return res.status(200).json({book});
  })  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    getBookByAsync({author: req.params.author})
    .then((book) => book ? res.json(book) : res.status(404).json({
      message: "unable to find book by author"
    }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    getBookByAsync({title: req.params.title})
    .then((book) => book ? res.json(book) : res.status(404).json({
      message: "No book was found with that title"
    }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
    res.send(books[isbn].reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
