const express=require('express')
const cors=require('cors')
require('dotenv').config()

//initialize express
const app=express()
app.use(express.json())
app.use(cors())
const port=process.env.PORT || 2020

app.get('/',(req,res) => {
    res.send('Hello World')
})




app.listen(port,() => {
    console.log('http://localhost:'+port);
})