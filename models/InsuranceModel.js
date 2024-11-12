const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    age: {
        type: String,
        required: [true, "age is required"],
    },
    isSmoker: {
        type: String,
    },
    insuranceCompany: {
        type: String,
    },
    claimAmount: {
        type: String,
    },
    hospitalName: {
        type: String,
        required: [true, "hospital name is required"],
    },
    city: {
        type: String,
        required: [true, "city is required"],
    },
    duration: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    }
});

const insuranceModel = mongoose.model("insurance", insuranceSchema);

module.exports = insuranceModel;