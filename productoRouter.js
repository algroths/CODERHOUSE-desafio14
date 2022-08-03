const { Router } = require('express')
const ContenedorProductos = require('./ContenedorProductos')
const { options } = require('./db/mysql')
const knex = require('knex')(options)
const passport = require('passport')



let cont = new ContenedorProductos(knex, 'products')


const productosRouter = Router()

productosRouter.get('', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}, async (req, res) => {
    const data = {
        productos: await cont.getAll(),
        activeP: true
    }
    return res.render('productos', data)
})

productosRouter.get('/table', async (req, res) => {
    return res.json(await cont.getAll())
})

productosRouter.post('', (req, res) => {
    let obj = req.body
    cont.save(obj)

    return res.redirect('/')
})

module.exports = productosRouter