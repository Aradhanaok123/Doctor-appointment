import React, {useEffect, useState} from 'react';
import Layout from './../../components/Layout';
import axios from 'axios';
import { message, Table } from 'antd';

const Doctors = () => {
  const [ doctors, setDoctors] = useState([]);

  //getUsers
  const getDoctors = async (req, res) => {
    try {
      const res = await axios.get("/api/v1/admin/getallDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle account
  const handleAccountStatus = async(record, status) => {
    try {
      const res = await axios.post("/api/v1/admin/changeAccountStatus",
        {doctorId: record._id, userid: record.userId, status: status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if(res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } 
    } catch (error) {
      message.error("Something went wrong");
    }
  }; 

  useEffect(() => {getDoctors();
  }, []);

//antd table column
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text,record) => (
      <span>{record.firstName} {record.lastName}</span>
    )
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Phone no",
    dataIndex: "phone",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    render: (text,record) => (
      <div className="d-flex">
        {record.status === "pending" ? (
          <button className="btn btn-success" onClick={() => handleAccountStatus(record, "approved")}>Approve</button>
         ) : (
         <button className="btn btn-danger">Reject</button>
        )}
      </div>
    ),
  },
];

  return (
    <Layout>
        <h1 className="text-center m-2">All Doctors</h1>
        <Table columns={columns} dataSource={doctors}/>
    </Layout>
  );
};

export default Doctors;