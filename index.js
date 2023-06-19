const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use(morgan('combine'))
const requestLogger=(request, response, next) =>{
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]



app.get("/api/persons", (req, res) => {
    res.json(persons);
})

app.get("/api/persons/:id", (req,res)=>{
  const id=Number(req.params.id)
  
    const findId=persons.find(person=>person.id===id)
  if (findId){
    // res.json(findId)
    res.send(`<h2>Name: ${findId.name}</h2><h2>Number: ${findId.number}`)
  }else{
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res)=>{
  const id=Number(req.params.id)
  const persons=persons.find(person=>person.id!==id)
  res.json(persons)
  res.status(204).end()
})

app.post('/api/persons', (req, res)=>{
  const body=req.body
  const findDuplicate=persons.find(person=>person.name===body.name)
  const generatedId=Math.floor(Math.random()*1000)
  
  if (!body.name || !body.number){
    return res.status(400).json({error: "Name or number missing"})
  }else if(findDuplicate){
      return res.json({error:"name must be unique"})
    }else{
      const person={
      "name": body.name, 
      "number": body.number,
      "id": generatedId,
    }
    persons=persons.concat(person)
    res.json(persons)
  }
})

app.get('/info', (req,res)=>{
  const nrPerson=persons.length
  const timeRequest= new Date()

  res.send(`<p>Phonebook has info for ${nrPerson} people</p><br/><p>${timeRequest}`)
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})