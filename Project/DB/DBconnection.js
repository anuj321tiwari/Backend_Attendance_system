import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()

const DBconnection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'attendancedb'
})
DBconnection.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err)
        return
    }
    console.log("DB Connected Successfuly")
})

export default DBconnection