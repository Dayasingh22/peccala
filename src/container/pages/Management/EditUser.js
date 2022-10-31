import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Spin, Modal, Select } from 'antd';
import { Button } from '../../../components/buttons/buttons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditUser = props => {
  const { singleUser } = props;
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading2, setLoading2] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (singleUser) {
      form.setFieldsValue({
        status: singleUser.kycRecord['Source of funds check'],
        userStatus: singleUser.user['Account verification (KYC)'],
      });
    }
  }, [singleUser]);

  const handleSubmit = values => {
    console.log(values);
    const payload = {
      'Source of funds check': values.status,
    };
    const payload2 = {
      'Account verification (KYC)': values.userStatus,
    };
    setLoading2(true);
    const token = process.env.REACT_APP_BUBBLE_TOKEN;
    const api = process.env.REACT_APP_API_ENDPOINT;
    const URL = `${api}kycprocess(knowyourcustomer)/${singleUser.kycRecord._id}`;
    const URL2 = `${api}user/${singleUser.user._id}`;
    var config = {
      method: 'patch',
      url: URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };
    var config2 = {
      method: 'patch',
      url: URL2,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: payload2,
    };
    axios(config)
      .then(function(response) {
        axios(config2)
          .then(function(response) {
            console.log('hgnhgnhgnhg', response);
            if (response.status === 204) {
              setLoading2(false);
              props.onAddEditUser(`${singleUser.user['authentication'].email.email} has been successfully Updated.`);
              props.onCancel();
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
      })
      .catch(function(error) {
        setLoading2(false);
        setFlag2(true);
        setError('Something went wrong, Please try again later');
      });
  };

  return (
    <>
      {singleUser ? (
        <Modal
          title={props.title}
          wrapClassName={props.wrapClassName}
          visible={props.visible}
          footer={null}
          onCancel={props.onCancel}
        >
          <Form name="editUser" form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={25}>
              <Col xxl={24} xl={24} lg={24} md={24} xs={24}>
                <Form.Item
                  name="status"
                  label="Docs Check Status"
                  rules={[{ required: true, message: 'Please select status!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="Select Status">
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Approved">Approved</Select.Option>
                    <Select.Option value="Rejected">Rejected</Select.Option>
                    <Select.Option value="Pending(Add Info)">Pending (add. info needed)</Select.Option>
                    <Select.Option value="Suspected">Suspected</Select.Option>
                    <Select.Option value="Expired">Expired</Select.Option>
                    <Select.Option value="Rejected">Rejected (retry)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xxl={24} xl={24} lg={24} md={24} xs={24}>
                <Form.Item
                  label="User Status"
                  name="userStatus"
                  rules={[{ required: true, message: 'Please select user status!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="User Status">
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Level 1">Level 1</Select.Option>
                    <Select.Option value="Level 2">Level 2</Select.Option>
                    <Select.Option value="Unverified">Unverified</Select.Option>
                    <Select.Option value="Failed">Failed</Select.Option>
                    <Select.Option value="Cannot Onboard">Cannot Onboard</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className="sDash-button-grp">
              {loading2 ? (
                <Spin size="medium" className="button-spinner" />
              ) : (
                <Button htmlType="submit" type="secondary" size="large" disabled={loading2}>
                  Update
                </Button>
              )}
            </div>
          </Form>

          <div>
            <p className="danger text-center" style={{ color: 'red', marginTop: '10px' }}>
              {flag2 ? error : ''}
            </p>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default EditUser;
