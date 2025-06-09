import express from 'express'
import { Router } from 'express'
import DbConnection from "./Project/DB/DBconnection.js"
import RegisterUser from './Project/routes/User_register.js'
import UserInfo from './Project/routes/User_info.js'
import Attendance from './Project/routes/Attendance_route.js'
import routes from './Project/routes/route.js'
import cors from 'cors'
import LeaveRoute from './Project/routes/LeaveApply_route.js'

const app = express()
const router = Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

let corsmiddleware = {
    origin:['http://localhost:8081'],
    method:['GET', 'POST', 'DELETE', 'PATCH']
}
app.use(cors(corsmiddleware))

router.get('/', (req, res) => {
    return res.status(200).json({ message: "this is Home Page"})
})

app.use('/', router)
app.use('/api', RegisterUser())
app.use('/api', UserInfo())
app.use('/api', Attendance())
app.use('/api', routes())
app.use('/api', LeaveRoute())

app.listen(8000,'0.0.0.0', () => {
    console.log("server is running on 8000")
})