import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Table, Modal, Skeleton, Tooltip, Tag, Alert } from 'antd';
import { AccountWrapper } from './style';
import { Cards } from '../../../../../components/cards/frame/cards-frame';
import { Button } from '../../../../../components/buttons/buttons';
import Heading from '../../../../../components/heading/heading';
import { Main, ExportStyleWrap, TableWrapper } from '../../../../styled';
import axios from 'axios';
import FeatherIcon from 'feather-icons-react';
import { UserTableStyleWrapper } from '../../../style';
import { getItem } from '../../../../../utility/localStorageControl';
import UserTransactionDetails from './UserTransactionDetails';

const Account = () => {
  const { Column } = Table;
  const [usersData, setUsersData] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal2, setShowModal2] = useState(false);
  const [singleUser, setSingleUser] = useState(null);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);

  useEffect(() => {
    const singleUser = getItem('currentUser');
    console.log('FBhnhg', singleUser._id);
    setUserInfo(singleUser);
    getUserTransactions(singleUser._id);
  }, []);

  useEffect(() => {}, []);

  const fetchUserDataFromBubble = async user_id => {
    const token = process.env.REACT_APP_PECCALA_TOKEN;
    const uid = {
      uid: user_id,
    };
    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.post('https://dev-api.peccala.com:8443/api/v1/users/getUserLogs', uid, headers);
    return result.data.data.allLogs;
  };

  const getUserTransactions = async user_id => {
    let allRecords = [];
    const fetchedData = await fetchUserDataFromBubble(user_id);
    allRecords = fetchedData;
    if (allRecords.length > 0) {
      let transactionsRecords = [];
      allRecords.map(record => {
        return transactionsRecords.push({
          key: record.uid,
          date:
            new Date(record.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) ?? '',
          action: record.action,
          amount:
            record.action === 'BUY'
              ? parseFloat(record.buyamount).toFixed(4)
              : record.action === 'SELL'
              ? parseFloat(record.sellamount).toFixed(4)
              : parseFloat(record.depositamount).toFixed(4),
          strategy: record.strategy,
          status: (
            <span className={`status ${record.status === 'Success' ? 'Success' : 'error'}`}>{record.status}</span>
          ),
          actions: (
            <div className="table-actions">
              <Tooltip title="View Details">
                <Button
                  className="btn-icon"
                  type="info"
                  shape="circle"
                  onClick={() => {
                    setUserInfo(record);
                    setShowModal2(true);
                  }}
                >
                  <FeatherIcon icon="wind" size={16} />
                </Button>
              </Tooltip>
            </div>
          ),
        });
      });
      setUsersData(transactionsRecords);
      setDataAvailable(true);
    }

    setLoading2(false);
  };

  const usersTableColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Strategy',
      dataIndex: 'strategy',
      key: 'strategy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      key: 'actions',
    },
  ];

  const handleCancel2 = () => {
    setShowModal2(false);
  };

  return (
    <AccountWrapper>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">All Transactions</Heading>
            <span>All transactions of the user</span>
          </div>
        }
      >
        <Row>
          <Col xs={24}>
            <ExportStyleWrap>
              {loading2 === true ? (
                <Skeleton active />
              ) : dataAvailable ? (
                <UserTableStyleWrapper>
                  <TableWrapper className="table-responsive">
                    <Table
                      id="myTable"
                      columns={usersTableColumns}
                      scroll={{ x: true }}
                      dataSource={usersData}
                      pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '30', `${usersData.length}`],
                        defaultPageSize: 5,
                        total: usersData.length,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      }}
                    />
                  </TableWrapper>
                </UserTableStyleWrapper>
              ) : (
                <Alert message="No Transactions available for this user" type="info" showIcon />
              )}
            </ExportStyleWrap>
          </Col>
        </Row>
      </Cards>
      <UserTransactionDetails
        title="User Transaction Details"
        wrapClassName="sDash_export-wrap"
        visible={showModal2}
        footer={null}
        onCancel={handleCancel2}
        singleTransaction={userInfo}
      />
    </AccountWrapper>
  );
};

export default Account;
