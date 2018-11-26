'use strict'

const express = require ('express')

const app = express()

const superagent = require('superagent')

const ejs = require('ejs')

const PORT = process.env.PORT || 5000

app.use(express.urlencoded({ extended:true }))

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
    
    res.render('pages/index')
})

app.post('/Search',(req,res)=>{
    const data = req.body
    let url = `https://www.googleapis.com/books/v1/volumes?q=${data}`
    req.body.param === 'title' ? url += `intitle:${data.searchText}` : url += `inauthor:${data.searchText}`
    console.log(data)

    superagent.get(url) 
            .then(book =>{
              let booksArr = book.body.items.map(val =>{
                  return new Book(val) 
              })  
            res.render('pages/searchResults',{ books: booksArr})
              })
            .catch(err => res.send({error:err, message:'Something broken'}))
})
app.get('*',(req,res)=>{
    res.status(404).send({status: res.status, message: 'Something is broke!'})
})

app.listen(PORT,()=>{
    console.log(`Server is now working on PORT${PORT}`)
})

const Book = function(book){
    this.title = book.volumeInfo.title
    this.author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'none'
    
}