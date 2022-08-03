const { options } = require('./sqlite')
const knex = require('knex')(options)

knex.schema
    .createTable('messages', table => {
        table.increments('id')
        table.string('email', 30)
        table.string('text', 300)
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .catch(err => console.log(`Error: ${err.message}`))
    .finally(() => knex.destroy())
