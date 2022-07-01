const { Admin } = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

class AdminServices{

    static async login( body ){
        const { email, password } = body

        try{
            const admin = await Admin.findOne({ where: { email } })
            console.log(email)
            console.log(password)
             if (!admin) return { error: true, data: { code:404, message: "Unauthorized" }}
            const isAdminValid = await bcrypt.compare(password, admin.password)
             if (!isAdminValid) return { error: true,  data: {code:401, message:" Unauthorized" }}
        
            const adminForToken = {
                id: admin.id,
                email: admin.email,
                superAdmin:admin.superAdmin
            }
            const token = jwt.sign(adminForToken, process.env.TOKEN_SECRET,{expiresIn: "24h"});
            return {error: false, data:{id:admin.id , email:admin.email ,superAdmin: admin.superAdmin }} 

        }
        catch( err ){
            return { error: true, data: {code:500 , message: 'Failed to login '} };
        }
    };

    static async register ( body ) {
        const { email } = body
         if (!email) return { error: true, data: { code: 400 , message: 'invalid email!' } };

        function passwordGenerator() {   // <==  this function generates a random Password
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let password= '';
            for ( let i = 1; i <= 11; i++ ) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return password  
        }

        try {
            const password = "123"  // passwordGenerator() should go here instead of "123"
            const newAdmin = await Admin.create({ email, password })
            //  Nodemailer config:
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  user: 'javi23dsc@gmail.com', 
                  pass: 'exxyryzyvodidxcz', 
                },
              });        
            //  Mail being sent here:
              let info = await transporter.sendMail({
                from: 'Net-Global@gmail.ar', 
                to: `${ email }`, 
                subject: 'New Admin Creation', 
                text: 'New Admin has been successfully created',
                html: `
                <h1>   ¡Net Global New Admin Account! </h1>
                <p> Hi! Net Global Staff has created for you a new Admin account. A Security password has been automatically set, however you are able to modify it to what you most prefer. Regardless you can change your password in case you forget it, we extremely recommend not to delete this massage unless you have already modified your password to another one</p> 
                <h2 >Admin Email: <span style="color: #B51313; font-size: 33px;"> ${ email }</span> </h2>
                <h2> Password:  <span style="color: #B51313; font-size: 33px;"> ${ password }</span> </h2>
                <h4> SHARING THIS INFORMATION IS COMPLETELY PROHIBITED. </h4>
                <p> Cordially, Net Global. </p> `  
              }); 
    
            return { error: false, data: { code: 201, message: 'New Admin has been successfully created' } }
       
        } catch ( err ) {
            return { error: true, data: { code: 500, message: "Register failed" } }
        }
    };

    static async forgotPassword ( body ) {
        const { email } = body; 
         if (!email) return { error: true, data: { code: 400 , message: 'invalid Email!' } };
        const admin = await Admin.findOne({ where: { email } });

        function tokenGenerator(){  // <== Generates the random token
            let token = []
            for (let i=1; i<=4; i++) {  
             token.push(Math.floor(Math.random()*10)) 
            }
           return token.join('')
        }

        try {                              
            const token = tokenGenerator()
            admin.recoveryKey = token;
            console.log(token)
            await admin.save() // token saved
            
            //  Nodemailer config:
            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: 'javi23dsc@gmail.com', 
                pass: 'exxyryzyvodidxcz', 
              },
            });
        
            //  Mail sending here:
            let info = await transporter.sendMail({
              from: 'Net-Global@gmail.ar', 
              to: `${ email }`, 
              subject: 'Generate New Password', 
              text: 'This is your personal token so as to create your new password',
              html: `<p> This is your personal token key which will allow yu to create a new password. Please, make sure you will not share it to anybody. </p> 
              <h1> ${ token } </h1>`
            });   

            const { password, recoveryKey, ...adminInfo } = admin.dataValues  // avoid sensitive data from being sent
            return { error: false, data: adminInfo  }

        } catch ( err ) {
            return { error: true, data: { code: 400, message: 'Something went wrong' } }
        }
    };

    static async tokenVerification ( body ) {
        const { email, recoveryKey: token } = body;
    
        try {
            const admin = await Admin.findOne({ where: { email } })
            const isAdminValid = await bcrypt.compare( token , admin.recoveryKey )
            return { error: false, data: { code: 202, message: "Authirized with Token Key" } }

        } catch {
            res.status(401).send('Unauthorized')
            return { error: true, data: { code: 401, message: 'Unauthorized' } }
        }
    };

    static async newPassword ( body ) {
        const { password, email } = body; 
         if (!password && email) return { error: true, data: { code: 401, message: 'Unauthorized' } }
        const admin = await Admin.findOne({ where: { email } }) 
    
        try { 
            admin.password = password; 
            await admin.save()  // new password saved
            return { error: false, data: { code: 200, message: 'new password has been set correctly' } }

        } catch {
            return { error: true, data: { code: 500, message: 'Something went wrong' } }
        }


    }
}

module.exports = AdminServices