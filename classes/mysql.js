const sql = require('mysql')
const creds = require('../config')

const connection = sql.createConnection({
    host: creds.MYSQL_HOST,
    user: creds.MYSQL_USER,
    password: creds.MYSQL_PASS,
    database: creds.MYSQL_DB,
})

connection.connect()


class mysql {
    constructor() {
        console.log('mysql client Created!')
    }

    executeQuery(query) {
        connection.query(query, (err, res, fields) => {
            if (err) throw err
            console.log(res)
        })
    }
}

exports.default = new mysql()
