import { Router } from "express";
import db from "../DB/DBconnection.js";
import { AuthorizationJWT } from "../Middleware/JWT_VerifyAuth.js";


const router = Router()

const Attendance = () => {

    router.post('/checkin', AuthorizationJWT, async(req, res) => {
        const userID = req.user.id
        const {check_in} = req.body
        if ([check_in].some((filed) => String(filed).trim() === "")) {
            res.send(401).json({message: "check in is required"})
            return
        }
        const checkintime = new Date()
        const checkinDate = checkintime.toISOString().split("T")[0] //extract Date

        const [existAttendance] = await db.promise().query(`select * from dailyattendance where AttendanceUser_id = ? and CHECK_IN_DATE = ?`,
            [userID,checkinDate], (err) => {
                if(err) return res.status(500).json({ message: "Database error", error: err });  
            }
        )
        if(existAttendance.length > 0){
            return res.status(400).json({ message: "Employee has already checked in today.", status:false })
        }

        //logic for 
        const [lastAttendance] = await db.promise().
        query(`select CHECK_IN_DATE from dailyattendance where AttendanceUser_id = ? order by CHECK_IN_DATE desc limit 1 `,
            [userID]
        )
        
        let LastAttendanceDate = lastAttendance.length > 0 ? lastAttendance[0].CHECK_IN_DATE : null ;

        if (LastAttendanceDate && LastAttendanceDate !== checkinDate) {
            const startDate = new Date(LastAttendanceDate)
            const endDate = new Date(checkinDate)
            
            while (startDate < endDate) {
                
                const missingDate = startDate.toISOString().split("T")[0]
                const [existingPresent] = await db.promise().query(
                    "SELECT * FROM dailyattendance WHERE AttendanceUser_id = ? AND CHECK_IN_DATE = ? AND Status = 'Present'",
                    [userID, missingDate]
                );

                if (existingPresent.length === 0) {
                    console.log(`Inserting Absent for: ${missingDate}`);
                    const [existingAbsent] = await db.promise().query(
                        "SELECT * FROM dailyattendance WHERE AttendanceUser_id = ? AND CHECK_IN_DATE = ? AND Status = 'Absent'",
                        [userID, missingDate]
                    );

                    if (existingAbsent.length === 0) {
                        await db.promise().query(
                            "INSERT INTO dailyattendance (AttendanceUser_id, CHECK_IN_DATE, CHECK_IN, CHECK_OUT, Status) VALUES (?, ?, ?, ?, ?)",
                            [userID, missingDate, 'Not Checked In', 'Not Checked Out', 'Absent']
                        );
                    }
                }
                
                startDate.setDate(startDate.getDate() + 1)
            }
        }
        try {
            await db.promise().query(`insert into dailyattendance(CHECK_IN, CHECK_IN_DATE, AttendanceUser_id) values(?,?,?)`,
                [check_in, checkinDate, userID]
            )
            return res.status(200).json({message: `Checked in at ${checkintime}`, status:true})
        } catch (error) {
            if (error) {
               return res.status(400).json({message:"Check in Not Done", status:false})
            }
        }  
    })

    router.post('/checkout', AuthorizationJWT, async(req, res) => {
        const userID = req.user.id
        const {check_out} = req.body
        const CheckoutTime = new Date()
        const checkoutdate = CheckoutTime.toISOString().split("T")[0]

        console.log(`User ID: ${userID}, Checkout Time: ${check_out}, Checkout Date: ${checkoutdate}`);

        try {
            const [chechkin_Check] = await db.promise().query(`select CHECK_IN from dailyattendance where AttendanceUser_id = ? and CHECK_IN_DATE = ? `,
                [userID, checkoutdate]
            )
            if (!chechkin_Check.length) {
                return res.status(400).json({ message: 'You must check in before you can check out.', status:false });
            }

            const [checkout_check] = await db.promise().query(`select CHECK_OUT from dailyattendance where AttendanceUser_id = ? and CHECK_IN_DATE = ? `,
                [userID, checkoutdate]
            )
            if(checkout_check.length > 0){
                return res.status(400).json({ message: 'You have already checked out for today.', status:false });
            }

            await db.promise().query(`update dailyattendance set CHECK_OUT = ? where AttendanceUser_id = ? and CHECK_IN_DATE = ?`,
                [check_out, userID, checkoutdate], 
            )
            return res.status(200).json({message: `Checked Out at ${check_out}`, status:true })
        } catch (error) {
            console.log("Error in Checkout Route: ", error)
            if (error) {
                return res.status(400).json({message:"Check Out Not Done", })
            }
        }
    })

    return router
}

export default Attendance