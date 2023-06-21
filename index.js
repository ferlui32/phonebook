require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require("./models/Phonebook")

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
  Phonebook.find({})
  .then(phonebook => {
    res.json(phonebook);
  })
})

app.get("/api/persons/:id", (req,res)=>{
  Phonebook.findById(req.params.id)
  .then(phonebook => {
    if(phonebook) {
      res.json(phonebook)
    } else {
      res.status(404).end()
    }
  })
  .catch(err => {
    console.log("", err)
    res.status(400).send({err: 'malformatted id'})
  })
})

app.delete('/api/persons/:id', (req, res)=>{

  Phonebook.findById(req.params.id)
  .then(phonebook => {
    res.json(phonebook)
  })
})

app.post('/api/persons', (req, res)=>{
  const body=req.body
  if (body.name === undefined || body.phone === undefined) {
    return res.status(400).json({error: "name or phone missing"})
  }

  const phonebook = new Phonebook({
    name: body.name,
    phone: body.phone,
  })

  phonebook.save()
  .then(savedPhone => {
    res.json(savedPhone)
  })


  // const findDuplicate=persons.find(person=>person.name===body.name)
  // const generatedId=Math.floor(Math.random()*1000)
  
  // if (body.name === undefined || body.number === undefined){
  //   return res.status(400).json({error: "Name or number missing"})
  // }else if(findDuplicate){
  //     return res.json({error:"name must be unique"})
  //   }else{
  //     const person= new Phonebook({
  //     name: body.name, 
  //     number: body.number,
  //   })
  //   person.save()
  //   .then(savedPhone)
  //   res.json(savedPhone)
  // }
})

app.get('/info', (req, res) => {
  Phonebook.countDocuments({})
    .then(count => {
      const nrPerson = count;
      const timeRequest = new Date();
      res.send(`<p>Phonebook has info for ${nrPerson} people</p><br/><p>${timeRequest}</p>`);
    })
    .catch(error => {
      console.error('Error retrieving person count:', error);
      res.status(500).send('Internal Server Error');
    });
});



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})