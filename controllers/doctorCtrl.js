const doctorModel = require("../models/DoctorModel");
const appointmentModel = require("../models/AppointmentModel");
const userModel = require("../models/userModels");

const getDoctorInfoController = async(req, res) => {
    try {
        const doctor = await doctorModel.findOne({userId: req.body.userId});
        res.status(200).send({
            success: true,
            message: "doctor data feching successful",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in fetching doctor data",
        });
    }
};

//update doc profile
const manageProfileController = async(req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId: req.body.userId}, req.body);
        res.status(201).send({
            success: true,
            message: "Doctor profile updated",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in doctor profile update",
        });
    }
};

//get single doctor 
const getDoctorByIdController = async(req, res) => {
    try {
        const doctor = await doctorModel.findOne({_id: req.body.doctorId});
        res.status(200).send({
            success: true,
            message: "Doctor info fetched",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error occured in fectching doctor info",
            error,
        });
    }
};

//get appointments list
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({userId: req.body.userId});
        const appointments = await appointmentModel.find({doctorId: doctor._id});
        res.status(200).send({
            success: true,
            message: "Appointment list fetched successfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in fetching appointment list",
        });
    }
};

//update appointments status
const updateStatusController = async(req, res) => {
    try {
        const {appointmentsId, status} = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, {status});
        const user = await userModel.findOne({_id: appointments.userId});
        user.notification.push({
            type: "status-updated",
            message: `Your appointment has been ${status}`,
            onClickPath: `/doctor-appointments`,
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment status updated",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in status update",
        });
    }
};

module.exports = {getDoctorInfoController, 
    manageProfileController, 
    getDoctorByIdController, 
    doctorAppointmentsController,
    updateStatusController};