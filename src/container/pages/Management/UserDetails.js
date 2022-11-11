import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form } from 'antd';
import { useHistory } from 'react-router-dom';
import { Button } from '../../../components/buttons/buttons';
import { setItem } from '../../../utility/localStorageControl';

const UserDetails = props => {
  const { singleUser } = props;
  const history = useHistory();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(singleUser);
  }, [singleUser]);

  const handleSubmit = values => {
    console.log(values);
  };

  const userDetails = () => {
    setItem('currentUser', JSON.stringify(singleUser));
    history.push({
      pathname: '/admin/user/details',
      state: user,
    });
  };

  const userTransactions = () => {
    setItem('currentUser', JSON.stringify(singleUser));
    history.push({
      pathname: '/admin/user/transactions',
      state: user,
    });
  };

  return (
    <>
      <Modal
        title={props.title}
        wrapClassName={props.wrapClassName}
        visible={props.visible}
        footer={null}
        onCancel={props.onCancel}
      >
        <Form name="user" form={form} onFinish={handleSubmit} layout="vertical">
          {user === null ? (
            ''
          ) : (
            <Row gutter={25}>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Email">
                  <p>{user['authentication'].email.email}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Full Name">
                  <p>{`${user['First Name'] ?? ''} ${user['Middle Name'] ?? ''} ${user['Last Name'] ?? ''}`}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Residence">
                  <p>{user['Country Of Residence'] ? user['Country Of Residence'].address : ''}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Joined">
                  <p>
                    {new Date(user['Created Date']).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) ?? ''}
                  </p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="email" label="Status">
                  <span
                    className={`status ${user['Account verification (KYC)'] === 'Unverified' ? 'warning' : 'Success'}`}
                  >
                    {user['Account verification (KYC)'] ?? ''}
                  </span>
                </Form.Item>
              </Col>
            </Row>
          )}
          <div className="sDash-button-grp">
            <Button
              className="btn-signin"
              type="primary"
              size="large"
              onClick={() => {
                userTransactions();
              }}
            >
              View Transactions History
            </Button>
            <Button
              className="btn-signin"
              type="warning"
              size="large"
              onClick={() => {
                userDetails(user);
              }}
            >
              Update User
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UserDetails;
