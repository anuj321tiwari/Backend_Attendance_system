import { Router } from "express";
import db from "../DB/DBconnection.js";
import { AuthorizationJWT } from "../Middleware/JWT_VerifyAuth.js";
import isAdmin from "../Middleware/isAdmin_authenticated.js";

const route =  Router()

const Admin_route = () => {
    route.get('/admin_get_alluser', async(req,res) => {
        try {
            const [response] = await db.promise().
            query(`SELECT u.id, u.email, u.role, ui.employee_id, ui.name 
                    FROM users as u
            JOIN userinfo ui on u.id = ui.User_id`)

            return res.status(200).json(response)
        
        } catch (error) {
            console.log("error from server in get all user : ", error)
            return res.status(500).json({message: "Something went wrong While getting all users from server", status:false})
        }
    })

    route.get('/admin_getAll_appliedleave', AuthorizationJWT, isAdmin, async(req, res) => {
        try {
            const [result] = await db.promise().
            query(`SELECT al.user_id, al.name, al.request_date,al.leave_type,al.reason from apply_leave as al
            WHERE Status = "Pending"; `)
            return res.status(200).json(result)
        } catch (error) {
            console.log("Error in Admin_All_appliedleave Route : ", error)
            return res.status(500).json({message: "Database Error Occured while Fetching applied Leave users"})
        }
    })
      
    route.patch('/admin_update_leave_Status/:id', AuthorizationJWT, isAdmin, async(req, res) => {
        const id = req.params.id
        console.log(req.body)
        const {status, date} = req.body
        try {
            await db.promise().query(`update apply_leave set Status = ? where user_id = ? and request_date = ?`, [status, id, date])
            return res.status(200).json('Leave request Status Changed')
        } catch (error) {
            console.log("Error in Server in admin_route in admin_update_leave : ", error)
            return res.status(500).json('server errors')
        }
    })
    return route
}

export default Admin_route