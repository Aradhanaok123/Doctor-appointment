const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getDoctorInfoController, 
    manageProfileController, 
    getDoctorByIdController, 
    doctorAppointmentsController, 
    updateStatusController} = require("../controllers/doctorCtrl");
    
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/manageProfile", authMiddleware, manageProfileController);

//POST GET SINGLE DOCTOR INFO
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

//GET APPOINTMENTS LIST
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

//POST APPOINTMENT STATUS UPDATE
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;