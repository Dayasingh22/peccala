import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Tooltip } from 'antd';
import { Cards } from '../../../../../components/cards/frame/cards-frame';
import { Button } from '../../../../../components/buttons/buttons';
import { BasicFormWrapper, TagInput } from '../../../../styled';
import Heading from '../../../../../components/heading/heading';
import { useHistory, useLocation } from 'react-router-dom';
import { getItem } from '../../../../../utility/localStorageControl';

const { Option } = Select;
const Profile = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading2, setLoading2] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const singleUser = getItem('currentUser');
    if (singleUser !== null) {
      form.setFieldsValue({
        name: singleUser['First Name'],
        email: singleUser['authentication'].email.email,
        phone: singleUser['Phone Number'],
        address: singleUser['Address_manual'],
        country: singleUser['Country Of Residence'].address,
        dob: new Date(singleUser['Date of Birth']).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        nationalities: singleUser['Nationality_1'].address,
        signup: new Date(singleUser['Created Date']).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        verificationLevel: singleUser['Account verification (KYC)'],
      });
    }
  }, []);

  const handleSubmit = values => {
    console.log(values);
    const payload = {
      authentication: values.email,
      'Phone Number': values.phone,
      Address_manual: values.address,
      'Country Of Residence': { ...singleUser['Country Of Residence'], address: values.country },
      Blocked: values.blocked,
      'Blocked Date': values.dateBlocked,
      'Blocked Status': values.blockedStatus,
    };
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
        <Col xl={20} lg={20} xs={24}>
          <BasicFormWrapper>
            <Form name="editProfile" onFinish={handleSubmit} form={form}>
              <Tooltip title="You can't edit this field">
                <Form.Item name="name" label="Name">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>

              <Form.Item name="email" label="Email Address">
                <Input type="email" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>
              <Form.Item name="country" label="Country">
                <Select style={{ width: '100%' }}>
                  <Option value="">Please Select</Option>
                  <Option value="bangladesh">Bangladesh</Option>
                  <Option value="india">India</Option>
                  <Option value="pakistan">Pakistan</Option>
                </Select>
              </Form.Item>
              <Tooltip title="You can't edit this field">
                <Form.Item name="dob" label="Date of Birth">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="nationalities" label="Nationalities">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="signup" label="Signup Date">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="verificationLevel" label="Verification Level">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="dateVerificationLevel" label="Date of Verification Level Changed">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Form.Item name="blocked" label="Blocked?">
                <Input />
              </Form.Item>
              <Form.Item name="dateBlocked" label="Date Blocked">
                <Input />
              </Form.Item>
              <Form.Item name="blockedStatus" label="Reason for Blocked Status">
                <Input />
              </Form.Item>
              <Tooltip title="You can't edit this field">
                <Form.Item name="walletAddress" label="Wallet Address">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="currentBalance" label="Current Balances">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="overallBalance" label="Overall Balance">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="transactions" label="Transaction history">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="amlQuestionnaire" label="AML questionnaire answers">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
              <Tooltip title="You can't edit this field">
                <Form.Item name="amountIntendedToInvest" label="Amount intended to invest">
                  <Input readOnly />
                </Form.Item>
              </Tooltip>
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
