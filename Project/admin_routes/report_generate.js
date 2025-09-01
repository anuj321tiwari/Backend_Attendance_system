import { Router } from "express";
import db from "../DB/DBconnection.js";
import Exceljs from 'exceljs'

const route = Router()

const Report_Generator = () => {
    route.post('/report', async(req, res) => {
        const {month, year} = req.body

        try {
            const [users] = await db.promise().query('select User_id, name,employee_id from userinfo')
            

            const [attendance] = await db.promise().query(
                'select AttendanceUser_id, CHECK_IN_DATE, Status from dailyAttendance where month(CHECK_IN_DATE) = ? and year(CHECK_IN_DATE) = ?',
                 [month,year] )
            
            if (attendance.length === 0) {
                return res.status(404).json({ message: `No attendance records found for ${month}/${year}` });
            }
            const attendanceMap = {}
            attendance.forEach(record => {
                const dateStr = record.CHECK_IN_DATE.toISOString().split('T')[0]
                if(!attendanceMap[record.AttendanceUser_id]) attendanceMap[record.AttendanceUser_id] = {};
                attendanceMap[record.AttendanceUser_id][dateStr] = record.Status
            })

            // res.status(200).json(attendanceMap)

            const workbook = new Exceljs.Workbook()
            const worksheet = workbook.addWorksheet(`Attendance Report ${month}${year}`)

            const daysInMonth = new Date(year, month, 0).getDate()
            const monthStr = month.toString().padStart(2, '0');
            const dateHeader = Array.from({length : daysInMonth}, (_, i) => {
                const day = (i + 1).toString().padStart(2,'0')
                return `${year}-${monthStr}-${day}`
            })
            
            worksheet.addRow(['Employee Name', ...dateHeader])

            users.forEach((user) => {
                const row = [user.name]
                dateHeader.forEach(date => {
                    const status = attendanceMap[user.User_id]?.[date] || 'Absent'
                    row.push(status)
                })
                worksheet.addRow(row)
            })
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.xlsx');
        
            await workbook.xlsx.write(res); // stream to response
            res.end();
        } catch(error) {
            console.error(error);
            res.status(500).send('Error generating report');
        }
    })
    return route
}

export default Report_Generator