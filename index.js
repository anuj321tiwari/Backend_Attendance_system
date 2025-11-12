import express from 'express'
import { Router } from 'express'
import DbConnection from "./Project/DB/DBconnection.js"
import AuthRoutes from './Project/routes/User_Auth_routes.js'
import UserInfo from './Project/routes/User_info.js'
import Attendance from './Project/routes/Attendance_route.js'
import routes from './Project/routes/route.js'
import cors from 'cors'
import LeaveRoute from './Project/routes/LeaveApply_route.js'
import Att_Summary from './Project/routes/Attendance_summary_routes.js'
import Report_Generator from './Project/admin_routes/report_generate.js'
import Leave_route from './Project/admin_routes/leave_route.js'
import Adding_Things from './Project/admin_routes/Category_route.js'

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
app.use('/api', AuthRoutes())
app.use('/api', UserInfo())
app.use('/api', Attendance())
app.use('/api', routes())
app.use('/api', LeaveRoute())
app.use('/api', Att_Summary())

//admin routes defined bellow
app.use('/api', Leave_route())
app.use('/api', Report_Generator())
app.use('/api', Adding_Things())

app.listen(8000,'0.0.0.0', () => {
    console.log("server is running on 8000")
})