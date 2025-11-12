import { Router } from "express";
import { AuthorizationJWT } from "../Middleware/JWT_VerifyAuth.js";
import db from "../DB/DBconnection.js";


const router = Router()

const UserInfo = () => {
    router.post('/userinfo', AuthorizationJWT, async(req, res) => {
        const user_id = req.user.id
        const {name, employee_id} = req.body
        if ([name, employee_id].some((field) => field.trim() === "")) {
            res.status(400).json( {message: "name and employee_id is required"})
            return
        }

        const [exists] = await db.promise().query(`select * from userinfo where employee_id = ?`,[employee_id])
        if (exists.length > 0) {
            return res.status(409).json({ message: 'Emplyoee Id exists!'})
        }
        try {
            const [userinfo] = await db.promise().query(`insert into userinfo(name, employee_id, User_id) values(?,?,?)`,
                [name, employee_id, user_id]
            )
            return res.status(200).json({message:"Information saved successfuly", userinfo})
        } catch (error) {
            console.log(error)
            res.status(400).json({message:"Somethig went wrong while saving userInfo"})
        }
    })
    return router
}

export default UserInfo