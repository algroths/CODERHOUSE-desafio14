class ContenedorProductos {

    constructor(obj, table) {
        this.knex = obj;
        this.table = table;
    }

    save(obj) {
        this.knex(this.table)
            .insert(obj)
            .then(() => console.log('Mensajes guardados'))
            .catch(err => console.log(`Error: ${err.message}`))
    }

    getAll() {
        return this.knex.from(this.table)
            .select('title', 'price', 'url')
            .then(message => {
                console.log(`Total de productos: ${message.length}`)
                message.forEach(product => console.log(`Producto: ${product.title}`))
                return message
            })
            .catch(err => console.log(`Error select productos: ${err.message}`))
    }
}

module.exports = ContenedorProductos;