const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require("../controllers/adminCtrl");
const router = express.Router();

//GET Method || USERS
router.get("/getallusers", authMiddleware, getAllUsersController);

//GET Method || DOCTORS
router.get("/getallDoctors", authMiddleware, getAllDoctorsController);

//POST || ACCOUNT STATUS
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

module.exports = router;
