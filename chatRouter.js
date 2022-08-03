const { Router } = require('express')
const ContenedorMessages = require('./ContenedorMessages')
const { options } = require('./db/sqlite')
const knex = require('knex')(options)

const messages = new ContenedorMessages(knex, 'messages')


const chatRouter = Router()


chatRouter.get('', async (req, res) => {

    try {
        const obj = await messages.getAll()
        return res.json(obj)
    } catch (e) {
        console.log("error get Chat router");
    }
})

module.exports = chatRouter