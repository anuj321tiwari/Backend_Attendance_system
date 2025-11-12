import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()

const DBconnection = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'attendancedb'
})
// DBconnection.connect((err) => {
//     if (err) {
//         console.log('Error connecting to the database:', err)
//         return
//     }
//     console.log("DB Connected Successfuly")
// })
DBconnection.getConnection((err, connection) => {
    if (err) {
        console.error('DB connection failed:', err)
        return
    }
    console.log('DB Connected Successfully')
    connection.release()  // return connection back to pool
})
// DBconnection.on('connection', function(connection) {
//     console.log('DB Connected Successfuly')

//     connection.on('error', function (err) {
//         console.error('MySQL error', err.code);
//       });
//     connection.on('end', function() {
//         console.log('Connection ended');
//     });
// })
export default DBconnection