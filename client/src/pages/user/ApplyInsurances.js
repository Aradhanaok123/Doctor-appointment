import React from 'react';
import Layout from '../../components/Layout';
import { Col, Form, Input, Row, TimePicker, message} from "antd";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {showLoading, hideLoading} from "../../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";

const ApplyInsurance = () => {
        const {user} = useSelector(state => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //handle form 
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            console.log(values)
            const res = await axios.post(
                "/api/v1/user/create-insurance", 
                {...values},
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
            dispatch(hideLoading());
            if(res.data.success){
                message.success(res.data.message);
                navigate("/");
            }else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something went wrong");
        }
    };
  return (
    <Layout>
        <h1 className="text-center">Apply Insurance</h1>
        <Form layout="vertical" onFinish={handleFinish} className="m-3">
            <h4 className="">Details :</h4>
            <Row gutter={20}>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Name" name="name" required rules={[{required: true}]}>
                        <Input type="text" placeholder="your name"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Age" name="age" required rules={[{required: true}]}>
                        <Input type="text" placeholder="your age"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Are you a smoker" name="isSmoker" required rules={[{required: true}]}>
                        <Input type="text" placeholder="are you a smoker"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Insurance company" name="insuranceCompany" required rules={[{required: true}]}>
                        <Input type="text" placeholder="insurance company name"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Claim Amount" name="claimAmount" required rules={[{required: true}]}>
                        <Input type="text" placeholder="claiming amount"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Hospital name" name="hospitalName" required rules={[{required: true}]}>
                        <Input type="text" placeholder="hospital name"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="City" name="city" required rules={[{required: true}]}>
                        <Input type="text" placeholder="your city"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Hospitalization" name="duration" required rules={[{required: true}]}>
                        <Input type="text" placeholder="hospitalization duration"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={8}></Col>
                <Col xs={24} md={24} lg={8}>
                    <button className="btn btn-primary form-btn" type="submit" >Submit</button>
                </Col>
            </Row>
        </Form>
    </Layout>
  )
}

export default ApplyInsurance;