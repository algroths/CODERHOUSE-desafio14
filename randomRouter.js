const { Router } = require("express")
const { fork } = require('child_process')

const randomRouter = Router()


randomRouter.get('', (req, res) => {
    const { num } = req.query
    const calculo = fork('./calculo.js', [num])

    calculo.on('message', msg => {

        const resultado = msg.reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {})

        return res.json(resultado)
    })


})

module.exports = randomRouter