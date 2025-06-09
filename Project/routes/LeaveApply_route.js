import { response, Router } from "express";
import db from "../DB/DBconnection.js";
import { AuthorizationJWT } from "../Middleware/JWT_VerifyAuth.js";

const route = Router()

const LeaveRoute = () => {
route.post('/leave/:id', AuthorizationJWT, async(req, res) => {
    const userId = req.params.id
    const {name, employee_id, leave_type, reason} = req.body

    const checkintime = new Date()
    const leaveDate = checkintime.toISOString().split("T")[0]

    if ([name, employee_id,leave_type, reason].some((field) => field.trim() === " ")) {
        res.status(400).json({message: "All Fields are required"})
        return
    }
    try {
        await db.promise().query(`insert into apply_leave(user_id, employee_id, name, request_date, leave_type, reason	) values(?,?,?,?,?,?)`,
            [userId, employee_id, name, leaveDate, leave_type, reason ]
        )
        return res.status(200).json({message: `Request Applied for ${reason} successfullly`, status:true})
    } catch (error) {
        res.status(400).json({ message:"something went wrong while sendfing leave request", status:false})
        console.log( "Something went wrong", error)
    }

})

route.get('/leave_get/:id', async(req, res) => {
    const userId = req.params.id
    try {
        const [response] = await db.promise()
        .query(`select u.id, la.user_id, la.employee_id, la.name, la.request_date, la.leave_type, la.reason, la.Status
                from users u 
                join apply_leave la on u.id = la.user_id
                where u.id = ?
            `, [userId])
        if (!response) {
            res.status(404).json({message: "no leave record found"})
            return
        }
        // const groupdata = {}

        // response.forEach(rec => {
        //     if(!groupdata[rec.id]){
        //         groupdata[rec.id] = {
        //             id:rec.id,
        //             user_id: rec.user_id,
        //             employee_id: rec.employee_id,
        //             name: rec.name,
        //             leaverequest : []

        //         }
        //     }
        //     groupdata[rec.id].leaverequest.push({
        //         Date: rec.request_date,
        //         status: rec.Status,
        //         leave_type: rec.leave_type,
        //         reason: rec.reason
        //     })
        // })
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({message:"Database error while retriving Leave Request for user id", success:false})
        console.log("from user leave get request: ", error)
    }
})

route.patch('/leave_status/:id', async(req, res) => {
    const id  = req.params.id
    const {StatusValue, dateuser} = req.body
    try {
        await db.promise().query(`update apply_leave set Status = ? where user_id = ? and request_date = ?`, [StatusValue, id, dateuser])
        res.status(200).json("updated satus")
    } catch (error) {
        res.status(400).json("unable to update leave status")
        console.log(error)
    }
})
return route
}

export default LeaveRoute