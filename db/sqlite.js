const options = {
    client: 'sqlite3',
    connection: {
        filename: "./db/mydb.sqlite"
    },
    useNullAsDefault: true
}

module.exports = {
    options
}