require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require("./models/Phonebook")

app.use(morgan('combine'))
const requestLogger=(request, response, next) =>{
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(requestLogger)

app.get("/api/persons", (req, res) => {
  Phonebook.find({})
  .then(phonebook => {
    res.json(phonebook);
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

})

app.get("/api/persons/:id", (req,res, next)=>{
  Phonebook.findById(req.params.id)
  .then(phonebook => {
    if(phonebook) {
      res.json(phonebook)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  console.log(req.params.id)
  const phonebook = {
    name: body.name,
    phone: body.phone,
  }

  Phonebook.findByIdAndUpdate(req.params.id, phonebook, { new: true })
    .then(updatedPhone => {
      res.json(updatedPhone)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next)=>{

  Phonebook.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
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
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})