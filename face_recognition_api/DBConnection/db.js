
const dotenv = require('dotenv')
dotenv.config();
const {Pool} = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    database: process.env.DB_DATABASE
});

//Get all the student
const getAllStudent = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) { 
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
//Get the student base on id
const getStudentId = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  //Create new User
  const createNewStudent = (request, response) => {
    const { id,name, attendence } = request.body
  
    pool.query('INSERT INTO users (id,name, attendence) VALUES ($1, $2,$3)', [id,name, attendence], (error, results) => {
      if (error) {
        throw error
      }
      console.log(request.body)
      response.status(201).send(`User added with name: ${name}`)
    })
  }
  

  //Update the status
  const updateUser = (request, response) => {
    //check the update 
    const id ="3";
    const  validate = request.body
    if(validate.check == "present"){
      pool.query(
        'UPDATE users SET attendence = $1 WHERE id = $2',
        ["absent", id],
        (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).json(`${id} modified with absent`)
        }
        
      )
    }else{
      response.json('Error something....')
    }
  }
  
  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }
  
  module.exports = {
    deleteUser,
    createNewStudent,
    updateUser,
    getStudentId,
    getAllStudent

  }