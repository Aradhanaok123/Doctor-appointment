const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/DoctorModel");
const appointmentModel = require("../models/AppointmentModel");
const insuranceModel = require("../models/InsuranceModel");
const moment = require('moment');
const { Router } = require("express");

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};
 
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({message: "user not found", success: false});
    } else {
      res.status(200).send({
        success: true, 
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({message: "auth error", success: false, error});
  }
};

//Apply Doctor CTRL
const aapplyDoctorController = async(req,res) => {
  try {
    const newDoctor = await doctorModel({...req.body, status:"pending"});
    await newDoctor.save();
    const adminUser = await userModel.findOne({isAdmin:true});
    const notification = adminUser.notification;
    notification.push({
      type:"apply-doctor-request",
      message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath:"/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, {notification});
    res.status(201).send({
      success:true,
      message:"Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while applying for Doctor",
    })
  }
};

//notification CTRL
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId});
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message:"all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send ({
      message:"Error in notification",
      success: false,
      error,
    });
  }
};

//delete notification CTRL
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId});
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message:"Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send ({
      success: false,
      message:"Unable to delete all notification",
      error,
    });
  }
};

//get all doctor
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({status: "approved"});
    res.status(200).send({
      success: true,
      message: "Doctor list fetched successfully",
      data: doctors,
    }) ;
  } catch (error) {
    console.log(error);
    res.status(500).send ({
      success: false,
      error,
      message: "Error while fetching doctor",
    });
  }
};

//book appointment
const bookAppointmentController = async(req,res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({_id: req.body.doctorInfo.userId});
    user.notification.push({
      type: "New-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: `/user/book-appointment`,
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    re.status(500).send({
      success: false,
      error,
      message: "Error while booking appointment",
    });
  }
};

//booking availability
const bookingAvailabilityController = async(req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,date,time:{
        $gte: fromTime, $lte: toTime,
      },
    });
    if(appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment not available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment available at this time",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in booking",
    });
  }
};

//appointment list
const userAppointmentController = async(req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in user appointment list",
    });
  }
};

//Apply Insurance CTRL
const applyInsuranceController = async(req,res) => {
  try {
    const newinsurance = await insuranceModel({...req.body, status:"pending"});
    await newinsurance.save();
    // const adminUser = await userModel.findOne({isAdmin:true});
    // const notification = adminUser.notification;
    // notification.push({
    //   type:"apply-insurance-request",
    //   message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a insurance request`,
    //   data: {
    //     doctorId: newDoctor._id,
    //     name: newDoctor.firstName + " " + newDoctor.lastName,
    //     onClickPath:"/admin/doctors",
    //   },
    // });
    // await userModel.findByIdAndUpdate(adminUser._id, {notification});
    res.status(201).send({
      success:true,
      message:"Insurance created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while applying for insurance",
    })
  }
};

//insurance list 
const getAllInsuranceController = async(req, res) => {
  try {
      const insurance = await insuranceModel.find({});
      res.status(200).send({  
          success: true,
          message: "Insurance list",
          data: insurance,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "error while fetching insurance data",
          error,
      });       
  }
};

//Insurance status
const insuranceStatusController = async(req, res) => {
  try {
      const {insuranceId, status} = req.body;
      const insurance = await insuranceModel.findByIdAndUpdate(insuranceId, {status});
      await insurance.save();
      res.status(201).send({
          success: "true",
          message: "Insurance status updated",
          data: insurance,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "error in insurance status",
          error,
      });       
  }
};

module.exports = {
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
  applyInsuranceController,
  getAllInsuranceController,
  insuranceStatusController};