const express  = require("express")
const cors = require('cors');
require('dotenv').config()
const assigments = require('./dummy.json');
const app = express()
const port = process.env.PORT || 3000


// middleware

app.use(cors())
app.use(express.json())




app.get('/', (req,res)=>{
    res.send("Collabora Task server is running...")
})

app.get('/assignments', (req,res)=>{
    res.send(assigments)
})
// id wise assignment
app.get('/assignments/:id', (req,res)=>{
    const id = parseInt(req.params.id )
    console.log(id);
    const assignment = assigments.find(assignment=>assignment.id === id )|| {}
    res.send(assignment)
})

app.listen(port, ()=>{
    console.log(`CollaboraTask server running on PORT: ${port}`);
})
