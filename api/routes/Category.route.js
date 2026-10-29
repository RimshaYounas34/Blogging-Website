import express from 'express'
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js'
import { onlyadmin } from '../middleware/onlyadmin.js'
import Category from '../models/category.model.js'
const CategoryRoute = express.Router()
CategoryRoute.post('/add', addCategory)
CategoryRoute.put('/update/:categoryid', updateCategory)
CategoryRoute.get('/show/:categoryid',onlyadmin, showCategory)
CategoryRoute.delete('/delete/:categoryid',  deleteCategory)
CategoryRoute.get('/all-category', getAllCategory)
 CategoryRoute.get('/get/count',(req,res)=>{
    Category.find().countDocuments()
    .then(result=>{
        res.status(200).json({
            total :result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
 })
export default CategoryRoute