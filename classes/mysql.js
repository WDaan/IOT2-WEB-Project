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

    async executeGetQuery(query) {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res, fields) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    async executeWriteQuery(query, data) {
        if (data) {
            return new Promise((resolve, reject) => {
                connection.query(query, data, (err, res, fields) => {
                    if (err) reject(err)
                    resolve(res)
                })
            })
        }
        return new Promise((res, rej) => rej('no data!'))
    }

    async getData(num = 10) {
        return this.executeGetQuery(`Select * from \`data\` order by id limit ${num}`)
    }

    async writeData(data) {
        if (data) {
            return this.executeWriteQuery('Insert into data SET ?', data)
        }
    }

    async addToCounter(name) {
        const query = `UPDATE \`counter\` SET value=value+1 WHERE name='${name}'`
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res, fields) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    async getCounters() {
        const query = 'select name, value from `counter`'
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res, fields) => {
                if (err) reject(err)
                resolve(JSON.stringify(res))
            })
        })
    }
}

exports.default = new mysql()
