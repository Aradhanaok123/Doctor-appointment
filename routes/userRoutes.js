const express = require("express");
const { 
    loginController, 
    registerController, 
    authController, 
    aapplyDoctorController, 
    getAllNotificationController, 
    deleteAllNotificationController, 
    getAllDoctorsController, 
    bookAppointmentController, 
    bookingAvailabilityController, 
    userAppointmentController,
    getAllInsuranceController,
    applyInsuranceController,
    insuranceStatusController} = require("../controllers/userCtrl");
const authMiddleware = require("../middleware/authMiddleware");


//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, aapplyDoctorController);

//Notification Doctor || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController);

//Notification Doctor || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

//Get All DOC || GET
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//Booking Availability
router.post("/booking-availability", authMiddleware, bookingAvailabilityController);

//Appointment List
router.get("/user-appointment", authMiddleware, userAppointmentController);

//Insurance list
router.get("/insurance", authMiddleware, getAllInsuranceController);

//Apply Insurance
router.post("/create-insurance", authMiddleware, applyInsuranceController);

//Insurance status
router.post("/insurance-status", authMiddleware, insuranceStatusController);

module.exports = router;