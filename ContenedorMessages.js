class ContenedorMessages {

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
            .select('email', 'created_at', 'text')
            .then(message => {
                console.log(`Total de mensajes: ${message.length}`)
                message.forEach(message => console.log(`Usuario: ${message.email} Mensaje: ${message.text}`))
                return message
            })
            .catch(err => console.log(`Error select: ${err.message}`))
    }
}

module.exports = ContenedorMessages