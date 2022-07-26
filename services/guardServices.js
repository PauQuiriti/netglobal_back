const { Op } = require("sequelize");
const { Guard, Province, Assignment, Branch } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const axios = require('axios')
const getDistanceInKM  = require('../functions/getDistanceInKm')
const formatDate = require('../functions/formatDate')
const moment = require('moment');
class GuardServices {
  static async getNextTasks(guardId){
    try{
    let result = []
   const guard = await Guard.findByPk(guardId)
   const assignments = await guard.getAssignments()
    const today = moment().format("YYYY-MM-DD").split("-").join("")
    const inTwoWeeks = moment().add( 14, 'days').toISOString().split("T")[0].split("-").join("")
     assignments.map((assignment)=>{
      let day = Number(assignment.endTime.toISOString().split("T")[0].split("-").join(""))
      if(day >= Number(today) && day<= Number(inTwoWeeks) ){
         result.push(assignment) }
    })
    const result2 = await Promise.all(result.map(async(assignment)=>{
      const assignment2 = {...assignment.dataValues}
      assignment2.branch = await assignment.getBranch()
      return assignment2
    }))
    const result3 = result2.sort((a,b)=> Number(a.date.split("-").join("")) - Number(b.date.split("-").join("")))
    return { error: false, data: result3 }
  }
 
    catch(error){
      return { error: true, data: error };
    }

  }
  static async getAll(page) {
    try {
      let guards;
      let totalPages = Math.ceil(await Guard.count()/30);
      let guards2=[]
      if(page>=2){
        guards = await Guard.findAll({ offset: (page-1)*30, limit: 30 });
      }
      else{
        let assignments;
        guards= await Guard.findAll({limit: 30});
        for (let i=0 ; i<guards.length ; i++){
          assignments = await guards[i].getAssignments(); 
          const tasks = assignments.reduce((acc, assignment) => {
            return assignment.dataValues.state === "PENDING"
              ? acc + 1
              : acc;
          }, 0);
          const workedHours = assignments.reduce((acc, assignment) => {
            return assignment.dataValues.state === "COMPLETED"
              ? acc + Number(assignment.dataValues.workedHours)
              : acc;
          }, 0);
          let vigilador={...guards[i].dataValues}
          vigilador["workedHours"] = workedHours.toFixed(2)
          vigilador["tasks"]= tasks
          guards2.push(vigilador)
        }
      }
    return { error: false, data: {guards:guards2,totalPages:totalPages} };
    
    } catch (error) {
      return { error: true, data: false };
    }
  }
  static async getOne(guardId) {
    try {
      const guard = await Guard.findByPk(guardId);
      let {password,...employee} = guard.dataValues 
      return { error: false, data: employee};
    } catch (error) {
      return { error: true, data:false };
    }
  }


  static async updateOne(body, guardId) {
    try {
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
      await Guard.update(body, { where: { id: guardId } });
      const guard = await Guard.findByPk(guardId);
      if(guard.active ===false)
      { 
        const today = new Date();
        await Assignment.destroy({
            where: {
              guardId: guardId,
              state: "PENDING",
              startTime: {
                [Op.gte]: today,
              },
            },
          });
      }
      if(body.licenses){
        const provinces = await Province.findAll({
          where: {
            id: { [Op.in]: body.licenses },
          },
        });
        await guard.setProvinces(provinces);
      }

      return { error: false };
    } catch (error) {
      return { error: true, data: false };
    }
  }
  static async getLicenses(guardId) {
    try {
      const user = await Guard.findByPk(guardId);
      const licenses = await user.getProvinces();
      return { error: false, data: licenses };
    } catch (error) {
      return { error: true, data: false };
    }
  }
  static async getWorkedHours(guardId, month) {
    try {
      let assignments;
      const guard = await Guard.findByPk(guardId);

      if (month) {
        assignments = await guard.getAssignments({ where: { month: month } });
      } else {
        assignments = await guard.getAssignments();
      }
      const workedHours = assignments.reduce((acc, assignment) => {
        return assignment.state === "COMPLETED"
          ? acc + Number(assignment.workedHours)
          : acc;
      }, 0);

      return { error: false, data: `${workedHours}` };
    } catch (error) {
      return { error: true, data: false };
    }
  }
  static async login(body){
    try{
      const guard= await Guard.findOne({ where: { email: body.email } })
      if (!guard) return { error: true, data:{code:404,message: 'invalid email or password!' }}
      const isValid= await bcrypt.compare( body.password, guard.password)
      if (!isValid) return { error: true, data: {code:401,message: 'invalid email or password!' }}
            const guardToken = {
               id: guard.id,
               email: guard.email,
             } 
                     //sign toma un usuario y una clave y devuelve un token de autenticacion 
          const token = jwt.sign(guardToken, process.env.TOKEN_SECRET,{expiresIn: "720m"});
            let {password,...employee} = guard.dataValues 
            return { error: false, data: {...employee, token} };

    }
    catch(error){
      return { error: true, data: false };
    }
  };

static async register ( body ) {
    
    const { email } = body
     if (!email) return res.status(400).send({ message: 'invalid email or password!' })
   
    function passwordGenerator() {   // <==  this function generates a random Password
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password= '';
    for ( let i = 1; i <= 11; i++ ) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
    }   

  try {
      const password = passwordGenerator() 
      body.password = password
      const licenses = body.licenses;
      delete body.licenses;
      if(body.street && body.number && body.location){
      let city; 
      city = body.location.split(" ").join("+")
      let geoloc = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=Hi8xaDQPxjO4mTdYh4yk4sfa5ewyjKcd&street=${body.number}+${body.street}&city=${city}&postalcode=${body.postalcode}&country=AR`)
      let coordinates = geoloc.data.results[0].locations[0].latLng
      let reverseGeoloc = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`)
      let street = geoloc.data.results[0].locations[0].street
      let d = getDistanceInKM(Number(coordinates.lat), Number(coordinates.lng),Number(reverseGeoloc.data.lat),Number(reverseGeoloc.data.lon))
      if (!(d<=0,1 && (street.length >=2))) {return { error: true, data:{code:400, message:"Not a valid address"}}};  
     if (d<=0,1 && (street.length >=2)){
      body.coordinateLatitude = Number(coordinates.lat)
      body.coordinateLength = Number(coordinates.lng)}
      const user = await Guard.create(body);
      const provinces = await Province.findAll({
        where: {
          id: { [Op.in]: licenses },
        },
      })
      await user.addProvinces(provinces)};  
      
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
        subject: 'Nueva cuenta Net Global', 
        text: 'Se ha creado un nuevo guardia. ',
        html: `
        <h1>   ¡Nueva cuenta Net Global! </h1>
        <p> ¡Hola! Net Global ha creado para ti una nueva cuenta de guardia. Se ha generado una contraseña de seguridad de manera automática, sin embargo usted puede modificarla si asi lo desea. Recomendamos no borrar este mensaje hasta haber modificado la contraseña por una de su agrado.</p> 
        <h2 > email: <span style="color: #B51313; font-size: 33px;"> ${ email }</span> </h2>
        <h2> Password:  <span style="color: #B51313; font-size: 33px;"> ${ password }</span> </h2>
        <h4> Queda terminantemente prohibido compartir esta información. </h4>
        <p> Atentamente, Net Global. </p>
        `  
      }); 

      return { error: false, data: { code: 201, message: "New Guard Account has been successfully created"} }

    } catch ( err ) {
      return { error: true, data: {message:"Failed to add guard", error:err} }
    };
   };

  static async forgotPassword ( body ) {
    const { email } = body; 
     if (!email) return { error: true, data: { code: 400 , message: 'invalid Email!' } };
    const guard = await Guard.findOne({ where: { email } });

    function tokenGenerator(){  // <== Generates the random token
      let token = []
      for (let i=1; i<=4; i++) {  
       token.push(Math.floor(Math.random()*10)) 
      }
     return token.join('')
    }

    try {                              
      const token = tokenGenerator()
      guard.recoveryKey = token;
      console.log("Token:",token)
      await guard.save() // token saved

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
        text: 'Este es su token , lo necesitarás para generar una nueva contraseña. ',
        html: `<p> Este es su token de seguridad , el mismo le  permitirá generar una nueva contraseña.Por favor no comparta esta información con terceros.</p>
        <h1> ${ token } </h1>`
      }); 

      
      const { password, recoveryKey, ...guardInfo } = guard.dataValues // avoid sensitive data from being sent
      return { error: false, data: guardInfo  }

    } catch ( err ) {
      return { error: true, data: false}
    }
  };

  static async tokenVerification ( body ) {
    const { email, recoveryKey: token } = body;

    try {
      const guard = await Guard.findOne({ where: { email } });
      const isGuardValid = await bcrypt.compare(token , guard.recoveryKey)
      if(isGuardValid)
      return { error: false, data: {message: "Authirized with Token Key" } }
      else
      return { error: true, data: false}

    } catch {
      return { error: true, data: false }
    }
  };

  static async newPassword ( body ) {
    const { password, email } = body; 
      if (!password && email) return { error: true, data: { code: 401, message: 'Unauthorized' } }
    const guard = await Guard.findOne({ where: { email } }) 

    try { 
      guard.password = password; 
      await guard.save()    // new password saved
      return { error: false, data: { code: 200, message: 'new password has been set correctly' } }

    } catch {
      return { error: true, data: false }
    }
  }
  static async getThem(guardId){
    try{
    const guard = await Guard.findByPk(guardId)
    const branches = await Branch.findAll()
    let availableBranches = []
    for(let i=0 ; i< branches.length ; i++){
     if(getDistanceInKM(branches[i].dataValues.coordinateLatitude,branches[i].dataValues.coordinateLength,guard.coordinateLatitude,guard.coordinateLength) <= 20){
      availableBranches.push(branches[i])
     }
    }
    return { error: false , data: availableBranches}
  }
    catch(error){
      return {error:true, data:error}
    }
  }
}

module.exports = GuardServices;
