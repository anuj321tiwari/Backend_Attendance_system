import { Router } from "express";
import db from "../DB/DBconnection.js";

const route =  Router()

const Admin_route = () => {
    route.get('/alluser', async(req,res) => {
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
    return route
}

export default Admin_route