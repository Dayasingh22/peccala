import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form } from 'antd';
import { useHistory } from 'react-router-dom';

const UserTransactionDetails = props => {
  const { singleTransaction } = props;
  const history = useHistory();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  const handleSubmit = values => {
    console.log(values);
  };

  console.log('BGgbhn', singleTransaction);

  return (
    <>
      <Modal
        title={singleTransaction ? `${singleTransaction.action} Transaction Details` : ''}
        wrapClassName={props.wrapClassName}
        visible={props.visible}
        footer={null}
        onCancel={props.onCancel}
      >
        <Form name="user" form={form} onFinish={handleSubmit} layout="vertical">
          {singleTransaction === null ? (
            ''
          ) : (
            <Row gutter={25}>
              {/* <p>
                {new Date(singleTransaction.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) ?? ''}
              </p> */}
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Status">
                  <span className={`status ${singleTransaction.status === 'Success' ? 'Success' : 'error'}`}>
                    {singleTransaction.status}
                  </span>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Investment Strategy">
                  <p>{singleTransaction.strategy}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Token Price">
                  <p>{singleTransaction.tokenprice} USDT</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item label="Amount Invested">
                  <p>{singleTransaction.spentamount} USDT</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="email" label="Tokens Issued">
                  <p>
                    {singleTransaction.action === 'BUY'
                      ? parseFloat(singleTransaction.buyamount).toFixed(4)
                      : singleTransaction.action === 'SELL'
                      ? parseFloat(singleTransaction.sellamount).toFixed(4)
                      : parseFloat(singleTransaction.depositamount).toFixed(4)}
                  </p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="email" label="Network Fee">
                  <p>{singleTransaction.gasfee} USDT</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="email" label="Transaction Hash">
                  <a href={`https://bscscan.com/tx/${singleTransaction.transactionHash}`} target="_blank">
                    {singleTransaction.transactionHash}
                  </a>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UserTransactionDetails;
