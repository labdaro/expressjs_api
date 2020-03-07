const express = require('express');
const router = express.Router()
const db = require('../DBConnection/db')
const userAuth = require('../DBConnection/auth')

router.get('/',(req,res)=>{res.json('Default Route')})

//Query all 
router.get('/users',db.getAllStudent);

//Query single
router.get('/users/:id',db.getStudentId);

//Insert the data
router.post('/users',db.createNewStudent);

//Update the data
router.put('/users',db.updateUser);

//Delete the data
router.delete('/users/:id',db.deleteUser);

router.post('/register',userAuth.userAuth)

router.post('/login',userAuth.loginAuth)


module.exports = router;