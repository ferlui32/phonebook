const mongoose = require('mongoose')

const phonebookSchema = new mongoose.Schema({
    name: String,
    phone: String,
  })
  
const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length===3){
    
    const password = process.argv[2]

    const url =
    `mongodb+srv://ferlui32:${password}@cluster0.mw2t0bs.mongodb.net/phonebookApp?retryWrites=true&w=majority`
    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    Phonebook.find({}).then(result => {
            console.log("Phonebook:")
            result.forEach(Phonebook => {
            console.log(`${Phonebook.name} ${Phonebook.phone}`)
        })
        mongoose.connection.close()
      })
}else{
    const password = process.argv[2]
    const newName = process.argv[3]
    const newPhone = process.argv[4]
    const url =
    `mongodb+srv://ferlui32:${password}@cluster0.mw2t0bs.mongodb.net/phonebookApp?retryWrites=true&w=majority`
    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    const phonebook = new Phonebook({
    name: `${newName}`,
    phone: `${newPhone}`,
})

phonebook.save().then(result => {
  console.log('added', `${newName} ${newPhone}`)
  mongoose.connection.close()
})
}

  

