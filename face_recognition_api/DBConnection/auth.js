const Joi = require('joi')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
dotenv.config();
const {Pool} = require('pg');
const bcrypt = require('bcryptjs')
const pool = new Pool({
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    database: process.env.DB_DATABASE
});

  //register the user
  const userAuth = async (request, response) => {
    const {username,password} = request.body
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.password,salt)
    console.log(hashPassword)
    console.log(typeof(hashPassword))

    pool.query('SELECT username FROM auth where username =$1',[username], (error, results) => {
      const id = uuid.v1()
      console.log(results.rows)
      //check is the username is already exist  
      if(Object.entries(results.rows).length === 0){
              const schema ={
                 username: Joi.string().trim().min(6).required(),
                 password: Joi.string().trim().min(6).required()
              }
              const {error} = Joi.validate(request.body,schema);
              if(error){
                response.status(400).send(error.details[0].message);
              }
              else{
                try {
                  pool.query('INSERT INTO auth (id,username,password) VALUES ($1, $2,$3)', [id,username,hashPassword], (error, results) => {
                  if (error) {  
                    throw error
                    }
                    console.log(request.body)
                    response.status(201).json({
                    "id":id,
                    "username": username,
                    "password": hashPassword,
                    "msg":"Register Successfully..."
                    })
                  })
              }catch (err) {
                  response.send(err)
              }
            }
          }else{
            response.send('Username is already exist.....')
         }     
    })
};


const loginAuth = async (request,response) =>{
      const {username,password} = request.body
      pool.query('select id,username,password from auth where username=$1',[username],(error,results)=>{
        if(Object.entries(results.rows).length === 0){
          response.status(400).send('Invalid the username...')      
        }
         if (Object.entries(results.rows).length != 0){
           // check password from database 
            const hashPass = results.rows[0].password
            //get id from database 
            const id = results.rows[0].id

            bcrypt.compare(request.body.password,hashPass,(err,isMatch)=>{
              if(!isMatch){
                response.status(400).send('Invalid password...')
              }else{
                //create and assgin a token
                //id send from the user
              const token = jwt.sign({_id:id},process.env.TOKEN_SECRET)
              response.header('auth-token',token).send(token)
              }
            })
        }
      })

    }
module.exports = {userAuth,loginAuth}