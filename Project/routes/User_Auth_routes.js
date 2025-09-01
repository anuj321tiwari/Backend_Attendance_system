import { Router } from "express";
import bycrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import db from "../DB/DBconnection.js";

const router = Router()

const AuthRoutes = () => {

    function passcode( length = 6){
        const text = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789"
        let code = ""
        for (let i = 0; i < length; i++) {
            code += text[Math.floor(Math.random() * text.length)]
        }
        return code
    }

    const Adminemail = "anuj321@gmail.com"
    router.post('/register', async (req, res) => {
        console.log('register hit')
        const {email, password, passcode} = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "email and password is required"})
        }

        try {
            const [rows] = await db.promise().query(`select * from passcode where code = ? and is_used = FALSE`,[passcode])
            if (rows.length === 0 || rows[0].assigned_email !== email) {
                return res.status(400).json({message:"invalid passcode or the passcode is not assigned to following email"})
            }

            const [exists] = await db.promise().query(`select * from users where email = ?`, [email]);
            if (exists.length > 0) {
                return res.status(409).json({ message: 'User email allready exists'})
            }

            const bycryptpassword = await bycrypt.hash(password, 10)

            const role = email === Adminemail ? 'admin' : 'user'

            await db.promise().query(
                `insert into users(email, password, role) values(? ,?,?)`, 
                [email, bycryptpassword, role]
            );

            await db.promise().query('update passcode set is_used = TRUE where code =?',[passcode])

            return res.status(201).json({ message: 'User registered successfully' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error during registration.' });
        }
    })

    router.post('/login', async(req, res) => {
        const {email, password} = req.body
        if (!email || !password) {
            res.status(400).json( {message: "email and password are required"})
        }
        try {
            const [result] = await db.promise().query(`select * from users where email = ?`,[email])
            if (result.length === 0) {
                return res.status(401).json({ message:"invalid email id or password "})
            }
            const user = result[0]
            
            const passISMatch = await bycrypt.compare(password, user.password)
            if (!passISMatch) {
                return res.status(401).json({ message:"Invalid email or password"})
            }
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role:user.role
            }, process.env.TOKEN_SECRETE)
            
            return res.status(200).json({message:"user login successful", token})
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message:" Database Error"})
        }
    })

    router.post('/passcode', async(req, res) => {
        const {email} = req.body;
        const code = passcode()

        if(!email){
            return res.status(404).json({message: "Email is require to generate passcode", status:false})
        }
        try{
            await db.promise().query(`insert into passcode(code,assigned_email) values(?,?)`,[code, email])
            return res.status(200).json({message:`Passcode generated :  ${code}`, status:true})
        }catch(err){
            if(err) return console.log("Error generating Passcode : ", err)
            res.status(401).json({ error: 'Failed to generate passcode', status:false})
        }

    })

    return router
}

export default AuthRoutes