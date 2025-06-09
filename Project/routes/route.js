import { Router } from "express";
import db from './../DB/DBconnection.js'
import { AuthorizationJWT } from "../Middleware/JWT_VerifyAuth.js";

const router = Router()

const routes = () => {
    router.get('/usersinfo/:id', async (req, res) => {
        const id = req.params.id
        const [rows] = await db.promise().
            query(`select u.id, u.email, ui.name, ui.employee_id from users u join userinfo ui on
            u.id = ui.User_id where u.id = ? `, [id])
        res.status(200).json(rows)
    })

    router.get('/users/:id', async (req, res) => {
        const id = req.params.id
        const groupeddata= {}
        const query = `SELECT u.id, u.email, u.role, ui.name, ui.employee_id, da.CHECK_IN, da.CHECK_OUT, da.CHECK_IN_DATE, da.Status 
                        FROM users u
                        JOIN userinfo ui on u.id = ui.User_id
                        LEFT JOIN dailyattendance da on u.id = da.AttendanceUser_id
                        WHERE u.id = ?`;
        try {
            const [result] = await db.promise().query(query, [id])
            if (result.length === 0) {
                return res.status(401).json({ message: "User Not Found", status: false })
            }

            result.forEach(rec => {
                // If user data is not already in groupeddata, initialize it
                if (!groupeddata[rec.id]) {
                    groupeddata[rec.id] = {
                        id:rec.id,
                        name: rec.name,
                        email:rec.email,
                        employee_id: rec.employee_id,
                        role: rec.role,
                        attendance : []
                    }
                }
                groupeddata[rec.id].attendance.push({
                    CHECK_IN: rec.CHECK_IN,
                    CHECK_OUT: rec.CHECK_OUT,
                    CHECK_IN_DATE: rec.CHECK_IN_DATE,
                    Status: rec.Status
                })
            })
            return res.status(200).json(Object.values(groupeddata)) // Convert the grouped object into an array
        } catch (error) {
            res.status(500).json({message:"Database error while retriving users with id", success:false, error})
        }
    })

    return router
}

export default routes