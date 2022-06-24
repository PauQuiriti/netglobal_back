const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Guard}= require ('../models')

const guardLogin = async(req,res)=>{
try{
    const guard= await Guard.findOne({ where: { email: req.body.email } })
    if (!guard) {res.status(401).send({message: 'invalid email and password!'}) }
    const isValid= await bcrypt.compare(req.body.password, guard.password)
          if (!isValid) return res.status(401).send({message: 'invalid email and password!'})
          const guardForToken = {
             id: guard.id,
             email: guard.email,
           } 
                   //sign toma un usuario y una clave y devuelve un token de autenticacion 
        const token = jwt.sign(guardForToken, '602b58ba85c1b52b7f86e58783fcb359c46daea3bbc0143744816f890a7042bc4f3049d646ed8e4254b6ba1c861367e137f1cd9eb29884680a2daf2620a5720b');
          let {password,...employee} = guard.dataValues 
          res.status(200).send({...employee, token}) 
         
      
}
catch(err){
    console.log(err)
}
}

module.exports = guardLogin