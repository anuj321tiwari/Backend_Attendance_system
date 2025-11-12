import { Router } from "express";
import db from "../DB/DBconnection.js";

const route = Router()

const Adding_Things = () => {
    route.post('/add_category', async(req, res) => {
        const { category_name } = req.body
        try {
            const [existing] = await db.promise().query('select * from category where category_name	= ? ', [category_name])
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Category Name All ready exists'})
            }
            await db.promise().query('insert into category(category_name) values(?) ', [category_name])
            return res.status(200).json({message:'Category Added Successfully', status:true})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'Server Error While Adding Category.', status:false })
        }
    })

    route.patch('/update_category/:id', async( req, res ) => {
        const id = req.params.id
        const {update_name} = req.body
        try {
            await db.promise().query('update category set category_name = ? where id = ? ', [update_name, id])
            res.status(200).json({message:'Category Name Updated Successfully', status:true})
        } catch (error) {
            console.log("Error Occured at update_category route: ", error)
            return res.status(500).json({message:'Server Error Updating Category Name', status:false})
        }
    })

    route.get('/get_category', async(req, res) => {
        try {
            const [response] = await db.promise().query(`select * from category;`)
            res.status(200).json(response)
        } catch (error) {
            console.log("Error in get_category: ", error)
            return res.status(500).json({message:'Server Error Getting Categorys'})
        }
    })
    return route
}

export default Adding_Things