import React,{useState, useEffect} from 'react'
import Layout from './../../components/Layout';
import axios from 'axios';
import moment from 'moment';
import { message, Table } from 'antd';

const InsuranceApproval = () => {
    const [insurances, setInsurances] = useState([]);

    const getAppointments = async() => {
        try {
            const res = await axios.get('/api/v1/user/insurance', {
                header: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
            });
            if(res.data.success) {
                setInsurances(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const handleStatus = async(record, status) => {
        try {
            const res = await axios.post('/api/v1/doctors/update-status', {appointmentsId: record._id, status}, {
                header: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
            });
            if (res.data.success) {
                message.success(res.data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            message.error("Something went wrong");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text,record) => (
                <span>
                    {record.name}
                </span>
            ),
        },
        {
            title: "Age",
            dataIndex: "age",
            render: (text,record) => (
                <span>
                    {record.age}
                </span>
            ),
        },
        {
            title: "Is smoker",
            dataIndex: "isSmoker",
            render: (text,record) => (
                <span>
                    {record.isSmoker}
                </span>
            ),
        },
        {
            title: "Insurance company",
            dataIndex: "insuranceCompany",
            render: (text,record) => (
                <span>
                    {record.insuranceCompany}
                </span>
            ),
        },
        {
            title: "Claim amount",
            dataIndex: "claimAmount",
            render: (text,record) => (
                <span>
                    {record.claimAmount}
                </span>
            ),
        },
        {
            title: "Hospital name",
            dataIndex: "hospitalName",
            render: (text,record) => (
                <span>
                    {record.hospitalName}
                </span>
            ),
        },
        {
            title: "City",
            dataIndex: "city",
            render: (text,record) => (
                <span>
                    {record.city}
                </span>
            ),
        },
        {
            title: "Hospitalization duration",
            dataIndex: "duration",
            render: (text,record) => (
                <span>
                    {record.duration}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text,record) => (
                <div className="d-flex">
                    {record.status === "pending" && (
                        <div className="d-flex">
                            <button className="btn btn-success" onClick={() => handleStatus(record, "approved")}>Approve</button>
                            <button className="btn btn-danger ms-2" onClick={() => handleStatus(record, "reject")}>Reject</button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

  return (
    <Layout>
        <h1>Insurance List</h1>
        <Table columns={columns} dataSource={insurances} />
    </Layout>
  )
}

export default InsuranceApproval