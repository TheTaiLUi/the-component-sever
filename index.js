require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const cors = require('cors')
const color = require('colors')
const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

// const uri = process.env.MongoDb
const uri = 'mongodb://localhost:27017'

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

const run = async () => {
  try {
    // database create
    const database = client.db('Component-Library')
    const category = database.collection('category-of-items')
    const elements = database.collection('elements')
    // =======================================================================
    //                                  category
    // get category
    app.get('/get-category/v1', async (req, res) => {
      const query = {}
      const result = await category.find(query).toArray()
      res.send(result)
    })

    // add category
    app.post('/post-category/v1', async (req, res) => {
      const body = req.body
      const result = await category.insertOne(body)
      res.send(result)
    })

    // =======================================================================
    //                                  elements
    // get category
    app.get('/get-elements/v1', async (req, res) => {
      const query = {}
      const result = await elements.find(query).toArray()
      res.send(result)
    })

    // get elements by category id
    app.get('/get-elements-by-query/v1', async (req, res) => {
      const category = req.query
      console.log(category)
      // get by category id
      if (category.hasOwnProperty('category_id')) {
        const query = { category_id: category.category_id }
        const result = await elements.find(query).toArray()
        return res.send(result)

        // get by elemets id
      } else if (category.hasOwnProperty('elements')) {
        const query = { _id: ObjectId(category.elements) }
        const result = await elements.find(query).toArray()
        return res.send(result)

        // get by category and elements id
      } else if (category.hasOwnProperty('preview')) {
        const query = { _id: ObjectId(category.preview) }
        const result = await elements.findOne(query)
        return res.send(result)

        // if not get all
      } else {
        const query = {}
        const result = await elements.find(query).toArray()
        return res.send(result)
      }
    })
  } finally {
  }
}

run().catch((err) => console.log(err))

//   start
app.get('/', (req, res) => {
  res.send('<h1>Server is Runing</h1>')
})

app.listen(PORT, () => {
  console.log('Server Is Runing'.bgBlue)
})
