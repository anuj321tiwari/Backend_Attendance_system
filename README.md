🧾 Attendance Management System – Backend

This repository contains the backend API for an Attendance Management System built with Express.js and MySQL.
It handles secure authentication, attendance tracking, leave management, and admin operations.

🛠️ Tech Stack

Backend Framework: Express.js

Database: MySQL

Authentication: JWT (JSON Web Token)

Environment: Node.js
-----------------------------------------------------------------------------------------------------------------------------
🚀 Features
👥 Role-Based Authentication

Separate login for Admin and User roles.

JWT-based authentication for secure access.
--------------------------------------------------------------------------
🕒 Attendance Management

Users can Punch In / Punch Out daily.

Automatically marks a user as Absent if they skip a day.

Attendance records stored and managed per user.
-------------------------------------------------------------------------
📅 Attendance & Leave

Users can view their attendance and absences.

Users can apply for leave via backend APIs.
-------------------------------------------------------------------------
🔐 Admin Functionalities

Admin can add, update, or delete users.

Admin can view all users’ attendance and leave records.

Passcode-based registration — new users can register only using an admin-provided passcode.

Admin can download monthly attendance reports with all users’ attendance data.
