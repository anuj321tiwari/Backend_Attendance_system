import { Router } from "express";
import db from "../DB/DBconnection.js";

const router =  Router()

const Att_Summary = () => {
    {/** Routes for monthly attendance Summary of overall users */}
    router.get('/monthly_attendance_summary', async(req, res) => {
    const Year = req.body
    try {
        const [rows] = await db.promise()
        .query(`select month(CHECK_IN_DATE) as month, year(CHECK_IN_DATE) as year, Status, count(*) as count from dailyattendance
            where year(CHECK_IN_DATE) = 2025 group by year, month, Status order by month
        `)
        const summary = {}
        const newSummary = []
        rows.forEach(row => {
            const month = new Date(row.year, row.month - 1).toLocaleString('default', {month:'short'})
            if(!summary[month]){
                // summary[month] = {Present: 0, Absent: 0, On_leave:0, Medical_leave:0}
                summary[month] = {
                    month : month,
                    Present : 0,
                    Absent : 0,              
                    onLeave: 0
                }
                newSummary.push(summary[month])
            }
            summary[month][row.Status] = row.count
        })
        return res.status(200).json(newSummary)
        
    } catch (error) {
        console.log("Error in Attendance Summary file",error)
        return res.status(403).json({message: "Unable to give data"})
    }

    })
    return router
}

export default Att_Summary
