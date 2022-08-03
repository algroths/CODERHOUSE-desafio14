const { options } = require('./mysql')
const knex = require('knex')(options)

knex.schema
    .createTable('products', table => {
        table.increments('id')
        table.string('title', 30)
        table.string('price', 5)
        table.string('url', 30)
    })
    .catch(err => console.log(`Error: ${err.message}`))
    .finally(() => knex.destroy())
