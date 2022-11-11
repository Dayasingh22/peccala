import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Spin } from 'antd';
import { Cards } from '../../../../../components/cards/frame/cards-frame';
import { Button } from '../../../../../components/buttons/buttons';
import { BasicFormWrapper, TagInput } from '../../../../styled';
import Heading from '../../../../../components/heading/heading';
import { useHistory, useLocation } from 'react-router-dom';
import { getItem } from '../../../../../utility/localStorageControl';
import axios from 'axios';

const { Option } = Select;
const Profile = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading2, setLoading2] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const singleUser = getItem('currentUser');
    console.log('Bgfb', singleUser);
    if (singleUser !== null) {
      form.setFieldsValue({
        name: `${singleUser['First Name'] ?? ''} ${singleUser['Middle Name'] ?? ''} ${singleUser['Last Name'] ?? ''}`,
        email: singleUser['authentication'].email.email,
        phone: singleUser['Phone Number'],
        address: singleUser['Address_manual'],
        country: singleUser['Country Of Residence'].address,
        dob: new Date(singleUser['Date of Birth']).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        nationalities1: singleUser['Nationality_1'].address ?? '',
        nationalities2: singleUser['Nationality_2'] ? singleUser['Nationality_2'].address : '',
        signup: new Date(singleUser['Created Date']).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        verificationLevel: singleUser['Account verification (KYC)'],
        blocked: singleUser['Blocked Account'] ?? '',
        blockedReason: singleUser['Blocked Reason'],
        blockedDate: singleUser['Blocked Date']
          ? new Date(singleUser['Blocked Date'][0]).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
      });
    }
  }, []);

  const handleSubmit = values => {
    const singleUser = getItem('currentUser');
    const blocked = values.blocked === singleUser['Blocked Account'] ? true : false;
    let payload = {};
    if (blocked) {
      payload = {
        'Phone Number': values.phone,
        Address_manual: values.address,
        'Country Of Residence': { ...singleUser['Country Of Residence'], address: values.country },
        'Blocked Status': values.blockedStatus,
      };
    } else {
      payload = {
        // email: values.email,
        'Phone Number': values.phone,
        Address_manual: values.address,
        'Country Of Residence': { ...singleUser['Country Of Residence'], address: values.country },
        'Blocked Account': values.blocked,
        'Blocked Date': [...singleUser['Blocked Date'], new Date()],
        'Blocked Status': values.blockedStatus,
      };
    }

    setLoading2(true);
    const token = process.env.REACT_APP_BUBBLE_TOKEN;
    const api = process.env.REACT_APP_API_ENDPOINT;
    const URL = `${api}user/${singleUser._id}`;
    var config = {
      method: 'patch',
      url: URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };
    axios(config)
      .then(function(response) {
        if (response.status === 204) {
          setLoading2(false);
        } else {
          setLoading2(false);
          setFlag2(true);
          setError('Something went wrong, Please try again later');
        }
      })
      .catch(function(error) {
        setLoading2(false);
        setFlag2(true);
        setError('Something went wrong, Please try again later');
      });
  };

  return (
    <Cards
      title={
        <div className="setting-card-title">
          <Heading as="h4">Edit User Details</Heading>
          <span>View and Edit User Details</span>
        </div>
      }
    >
      <Row>
        <Col xl={24} lg={24} xs={24}>
          <BasicFormWrapper>
            <Form name="editProfile" onFinish={handleSubmit} form={form}>
              <div className="non-editable">
                <p className="text-center">Editable Fields</p>
                <Row gutter={25} className="user-details">
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="email" label="Email Address">
                      <Input type="email" />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="phone" label="Phone Number">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="address" label="Address">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="country" label="Country">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="dob" label="Date of Birth">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="blocked" label="Blocked?">
                      <Select style={{ width: '100%' }} placeholder="Blocked?">
                        <Select.Option value="Buy">Buy</Select.Option>
                        <Select.Option value="All transactions">All transactions</Select.Option>
                        <Select.Option value="App access">App access</Select.Option>
                        <Select.Option value="Withdraw">Withdraw</Select.Option>
                        <Select.Option value="Sell">Sell</Select.Option>
                        <Select.Option value="Deposit">Deposit</Select.Option>
                        <Select.Option value="">Unblock</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="blockedReason" label="Blocked Reason">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className="non-editable">
                <p className="text-center">Non Editable Fields</p>
                <Row gutter={25} className="user-details">
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="name" label="Full Name">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="nationalities1" label="Nationality">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="nationalities2" label="2nd Nationality">
                      <Input readOnly />
                    </Form.Item>
                  </Col>

                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="signup" label="Signup Date">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="verificationLevel" label="Verification Level">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="walletAddress" label="Wallet Address">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12} xs={24}>
                    <Form.Item name="blockedDate" label="Blocked Date">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="setting-form-actions">
                {loading2 ? (
                  <Spin size="medium" className="button-spinner" />
                ) : (
                  <Button size="default" htmlType="submit" type="primary" disabled={loading2}>
                    Update User Details
                  </Button>
                )}
              </div>
            </Form>
          </BasicFormWrapper>
          <div>
            <p className="danger text-center" style={{ color: 'red', marginTop: '10px' }}>
              {flag2 ? error : ''}
            </p>
          </div>
        </Col>
      </Row>
    </Cards>
  );
};

export default Profile;
