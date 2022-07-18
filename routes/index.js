const express = require('express');
const router = express.Router();
const companyRouter= require('./company')
const authAdmin = require('../middleware/authAdmin')
const guardRoutes = require("./guardRoutes")
const assignmentRoutes = require("./assignmentRoutes");
const branchesRouter = require('./branches');
const inactiveRoutes = require("./inactiveRoutes");
const GuardController = require("../controllers/guardController");
const CompanyController = require('../controllers/companyController');
const BranchController = require('../controllers/branchController');
const AdminController = require('../controllers/AdminController');
const ProvinceController = require('../controllers/ProvinceController')
const adminRoutes = require('./adminRoutes');
const multer = require('multer');
const upload = require('../middleware/upload');
const superAdminAuth = require('../middleware/superAdminAuth')
router.use("/guards",guardRoutes)
router.use("/assignments",assignmentRoutes)
router.use("/inactivities",inactiveRoutes)
router.post("/login", AdminController.login)
router.use("/company", companyRouter)
router.use("/branch", branchesRouter)
router.use("/admin", adminRoutes)
router.get("/",(req,res)=>{
    res.send('Hello,world')
})

//ruta para testear autorizacion 
router.post("/auth", authAdmin)
//search routes 
router.post("/search/company", CompanyController.search)
router.post("/search/branch", BranchController.search)
//register routes
router.post("/register/admin",superAdminAuth , AdminController.register)
router.post("/register/guard",  authAdmin,GuardController.register)
router.get("/provinces",ProvinceController.getAll)


//routes of "I Forgot my Password" for Guards                                            
router.post('/forgot-password', GuardController.forgotPassword);//1° Send Email with recovery Token         
router.post('/token', GuardController.tokenVerification);       //2° verify if token matches        
router.put('/new-password', GuardController.newPassword);       //3° re-write User-password    


// router.put('/upload',upload,(req,res)=>{
//     console.log(req.file)
//     res.send('Uploaded')    
// })

module.exports = router
 