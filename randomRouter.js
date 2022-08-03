const { Router } = require("express")
const { fork } = require('child_process')

const randomRouter = Router()


randomRouter.get('', (req, res) => {
    const { num } = req.query
    const calculo = fork('./calculo.js', [num])

    calculo.on('message', msg => {
        return res.end(msg)
    })


})

module.exports = randomRouter