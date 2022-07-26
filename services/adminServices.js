const { Admin } = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const axios = require('axios')
const getDistanceInKM  = require('../functions/getDistanceInKm')
class AdminServices{

    static async login( body ){
        const { email, password } = body

        try{
            const admin = await Admin.findOne({ where: { email } })
             if (!admin) return { error: true, data: { code:404, message: "Email not found" }}
            const isAdminValid = await bcrypt.compare(password, admin.password)
             if (!isAdminValid) return { error: true,  data: {code:401, message:" Unauthorized ,incorrect password" }}
        
            const adminForToken = {
                id: admin.id,
                email: admin.email,
                superAdmin:admin.superAdmin
            }
            const token = jwt.sign(adminForToken, process.env.TOKEN_SECRET,{expiresIn: "24h"}); 
            return {error: false, data:{ id:admin.id , cuil:admin.cuil, email:admin.email ,superAdmin: admin.superAdmin, name: admin.name, lastName: admin.lastName, image: admin.image, recoveryKey: admin.recoveryKey, number:admin.number,street:admin.street, location:admin.location, coordinateLatitude: admin.coordinateLatitude, coordinateLength:admin.coordinateLength ,token:token }} 

        }
        catch( err ){
            return { error: true, data: false };
        }
    };

    static async register ( body ) {
         const {email} = body 
         if (!email) {return { error: true, data: { code:404, message: "Email not valid" }}}

        function passwordGenerator() {   // <==  this function generates a random Password
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let password= '';
            for ( let i = 1; i <= 11; i++ ) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return password  
        }

        try {
      const password = passwordGenerator()
      body.password = password 
      if(body.street && body.number && body.location){
        let city; 
        city = body.location.split(" ").join("+")
        let geoloc = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=Hi8xaDQPxjO4mTdYh4yk4sfa5ewyjKcd&street=${body.number}+${body.street}&city=${city}&postalcode=${body.postalcode}&country=AR`)
        let coordinates = geoloc.data.results[0].locations[0].latLng
        let reverseGeoloc = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`)
        let street = geoloc.data.results[0].locations[0].street
        let d = getDistanceInKM(Number(coordinates.lat), Number(coordinates.lng),Number(reverseGeoloc.data.lat),Number(reverseGeoloc.data.lon))
        if (!(d<=0,1 && (street.length >= 2))){ return { error: true, data:{code:400, message:"Not a valid address"}};}
        body.coordinateLatitude = Number(coordinates.lat)
        body.coordinateLength = Number(coordinates.lng)
      }
      const newAdmin = await Admin.create( body )
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
                <h1>   ¡Net Global Nueva Cuenta de  Admin ! </h1>
                <p> ¡Hola! Net Global ha generado para ti una nueva cuenta de administrador. Se ha generado una contraseña de seguridad de manera automática, sin embargo usted puede modificarla si asi lo desea. Recomendamos no borrar este mensaje hasta haber modificado la contraseña por una de su agrado.</p> 
                <h2 >Admin Email: <span style="color: #B51313; font-size: 33px;"> ${ email }</span> </h2>
                <h2> Contraseña:  <span style="color: #B51313; font-size: 33px;"> ${ password }</span> </h2>
                <h4> Queda terminantemente prohibido compartir esta información. </h4>
                <p> Atentamente, Net Global. </p> `  
              })
    
          if(newAdmin) {return { error: false, data: { code: 201, message: 'New Admin has been successfully created' } }}
            
        } 
        catch (err) {
            return { error: true, data: { code: 500 , message: 'Failed to create new admin account' , error:err}}
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
              subject: 'Generar nueva contraseña', 
              text: 'Este es su token , lo necesitarás para generar una nueva contraseña.',
              html: `<p>Este es su token de seguridad , el mismo le  permitirá generar una nueva contraseña.Por favor no comparta esta información con terceros. </p> 
              <h1> ${ token } </h1>`
            });   

            const { password, recoveryKey, ...adminInfo } = admin.dataValues  // avoid sensitive data from being sent
            return { error: false, data: adminInfo  }

        } catch ( err ) {
            return { error: true, data: false }
        }
    };

    static async tokenVerification ( body ) {
        const { email, recoveryKey: token } = body;
    
        try {
            const admin = await Admin.findOne({ where: { email } })
            const isAdminValid = await bcrypt.compare( token , admin.recoveryKey )
            console.log(isAdminValid)
            if (isAdminValid) return { error: false, data: { code: 202, message: "Authirized with Token Key" } }
             return { error: true, data: "Unauthorized"  }
        } catch {
            res.status(401).send('Unauthorized')
            return { error: true, data: false }
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
            return { error: true, data: false }
        }


    }
    static async getAll(page){
        let admins;
        let totalPages = Math.ceil(await Admin.count()/30);
  
        if(page>=2){
          admins = await Admin.findAll({ offset: (page-1)*30, limit: 30 });
        }
        else{
          admins= await Admin.findAll({limit: 30});
        }
        return { error: false, data: {admins:admins, totalPages:totalPages} };
  
      } catch (error) {
        return { error: true, data: false };
      }
      static async getOne(id) {
          try {
            const admin = await Admin.findByPk(id);
            let {password,...employee} = admin.dataValues 
            if(admin) return { error: false, data: employee}
          } catch (error) {
            return { error: true , data: false};
          }
        }
        static async deleteOne(adminId) {
          try {
            await Admin.destroy({ where: { id: adminId } });
            return { error: false };
          } catch (error) {
            return { error: true, data: false };
          }
        }
        static async updateOne(body, adminId) {
          try{
            if(body.street && body.number && body.location){
              let city; 
              city = body.location.split(" ").join("+")
              let geoloc = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=Hi8xaDQPxjO4mTdYh4yk4sfa5ewyjKcd&street=${body.number}+${body.street}&city=${city}&country=AR`)
              let coordinates = geoloc.data.results[0].locations[0].latLng
              let reverseGeoloc = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`)
              let street = geoloc.data.results[0].locations[0].street
              let d = getDistanceInKM(Number(coordinates.lat), Number(coordinates.lng),Number(reverseGeoloc.data.lat),Number(reverseGeoloc.data.lon))
              if (!(d<=0,1 && (street.length >= 2))){ return { error: true, data:{code:400, message:"Not a valid address"}};}
              body.coordinateLatitude = Number(coordinates.lat)
              body.coordinateLength = Number(coordinates.lng)
            }
              await Admin.update(body, { where: { id: adminId } });
              return { error: false};
          }
          catch(error){
              return { error: true, data: false };
          }
        }
     
}


module.exports = AdminServices