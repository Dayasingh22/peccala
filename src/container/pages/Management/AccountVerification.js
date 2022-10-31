import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Input, Select, Alert, Skeleton, Form, Tooltip } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import { UserTableStyleWrapper } from '../style';

import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import EditUser from './EditUser';
import Heading from '../../../components/heading/heading';
import { Button } from '../../../components/buttons/buttons';

const AccountVerification = () => {
  const { Column } = Table;
  const location = useLocation();
  const history = useHistory();
  const [selectFilter, setSelectFilter] = useState('');
  const [show, setShow] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [reference, setReference] = useState([]);
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [loading2, setLoading2] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [singleUser, setSingleUser] = useState(null);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const showModal3 = () => {
    setIsModalVisible2(true);
  };
  const handleCancel3 = () => {
    getAllKYCData();
    setIsModalVisible2(false);
  };

  useEffect(() => {
    if (location.state !== null && location.state !== undefined) {
      setShowAlert(true);
      setAlertText(location.state.detail);
      setAlertType('success');
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    getAllKYCData();
  }, []);

  const fetchUserDataFromBubble = async cursor => {
    const token = process.env.REACT_APP_BUBBLE_TOKEN;
    const api = process.env.REACT_APP_API_ENDPOINT;
    const URL = `${api}user?cursor=${cursor}`;
    const config = {
      method: 'get',
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(URL, config);
    let data = await response.data.response;

    return data;
  };

  const fetchUserKYCDataFromBubble = async cursor => {
    const token = process.env.REACT_APP_BUBBLE_TOKEN;
    const api = process.env.REACT_APP_API_ENDPOINT;
    const URL = `${api}kycprocess(knowyourcustomer)?cursor=${cursor}`;
    const config = {
      method: 'get',
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(URL, config);
    let data = await response.data.response;

    return data;
  };

  const getAllKYCData = async () => {
    let allRecords = [];
    let remainingPages = 1;
    let cursor = 0;
    let allKycRecords = [];
    let remainingKycPages = 1;
    let kycCursor = 0;
    const filteredKycData = [];
    while (remainingPages > 0) {
      const fetchedData = await fetchUserDataFromBubble(cursor);
      allRecords = [...allRecords, ...fetchedData['results']];
      cursor += fetchedData['count'];
      const remaining = fetchedData['remaining'];
      if (remaining != 0) {
        remainingPages = 1;
      } else {
        remainingPages = -1;
      }
    }

    while (remainingKycPages > 0) {
      const fetchedKycData = await fetchUserKYCDataFromBubble(kycCursor);
      allKycRecords = [...allKycRecords, ...fetchedKycData['results']];
      kycCursor += fetchedKycData['count'];
      const kycRemaining = fetchedKycData['remaining'];
      if (kycRemaining != 0) {
        remainingKycPages = 1;
      } else {
        remainingKycPages = -1;
      }
    }

    allKycRecords.map(record => {
      if (record['Source of funds check']) {
        if (record['Source of funds check'] != 'pending') {
          allRecords.map(user => {
            if (user._id == record['Related User']) {
              filteredKycData.push({ user, kycRecord: record });
            }
          });
        }
      }
    });

    const users = filteredKycData.reverse();
    console.log('Bgbgf', users);
    let usersTableData = [];
    users.map(user => {
      return usersTableData.push({
        key: user.kycRecord['_id'],
        user: (
          <div className="user-info">
            <figcaption>
              <Heading className="user-name" as="h6">
                {`${user.user['First Name'] ?? ''} ${user.user['Middle Name'] ?? ''} ${user.user['Last Name'] ?? ''}`}
              </Heading>
              <span className="user-designation">{user.user['authentication'].email.email}</span>
            </figcaption>
          </div>
        ),
        documents:
          user.kycRecord['Proof of funds docs'] != null
            ? user.kycRecord['Proof of funds docs'].map(rec => (
                <div className="user-info">
                  <figcaption>
                    <Heading className="user-name" as="h6">
                      <a href={rec} download target="_blank" className="documents">
                        <span style={{ marginRight: '10px', color: 'black' }}>
                          {decodeURIComponent(rec.split('/').pop())}
                        </span>
                        <FeatherIcon icon="download" size={16} />
                      </a>
                    </Heading>
                  </figcaption>
                </div>
              ))
            : '',
        expectedInvestment: user.kycRecord['Expected investment'] ?? '',
        submissionDate:
          new Date(user.kycRecord['POF Submission date']).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) ?? '',
        docStatus: user.kycRecord['Source of funds check'] ?? '',
        userStatus: user.user['Account verification (KYC)'] ?? '',
        action: (
          <div className="table-actions">
            <Tooltip title="Update Status">
              <Button
                className="btn-icon"
                type="info"
                shape="circle"
                onClick={() => {
                  showModal3();
                  setSingleUser(user);
                }}
              >
                <FeatherIcon icon="edit" size={16} />
              </Button>
            </Tooltip>
          </div>
        ),
      });
    });
    setUsersData(usersTableData);
    setReference(usersTableData);
    setLoading2(false);
  };

  const usersTableColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Documents',
      dataIndex: 'documents',
      key: 'documents',
    },
    {
      title: 'Expected Investment',
      dataIndex: 'expectedInvestment',
      key: 'expectedInvestment',
    },
    {
      title: 'Submission Date',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
    },
    {
      title: 'Docs Check Status',
      dataIndex: 'docStatus',
      key: 'docStatus',
    },
    {
      title: 'User Status',
      dataIndex: 'userStatus',
      key: 'userStatus',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const selectedFilter = e => {
    setShow(true);
    setSelectFilter(e);
  };

  const filterFunction = e => {
    var selectedFilter = selectFilter;
    var x = 0;
    if (selectedFilter === 'email') {
      x = 0;
    }
    if (selectedFilter === 'name') {
      x = 1;
    }

    if (x === 0) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry =>
        entry.user.props.children.props.children[1].props.children.toLowerCase().includes(currValue),
      );
      setUsersData(filteredData);
    }
    if (x === 1) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry =>
        entry.user.props.children.props.children[1].props.children.toLowerCase().includes(currValue),
      );
      setUsersData(filteredData);
    }
  };

  const addEditUser = val => {
    setShowAlert(true);
    setAlertText(val);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <>
      <PageHeader title="User who uploaded proof of funds" />
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <ExportStyleWrap>
              <Cards headless>
                <div className="sDash_export-box" style={{ marginBottom: '20px' }}>
                  <div></div>
                  <div>
                    <Select placeholder="Search By" style={{ marginRight: '10px' }} onChange={selectedFilter}>
                      <Select.Option value="email">Email</Select.Option>
                      <Select.Option value="name">Name</Select.Option>
                    </Select>
                    <Input
                      placeholder="Search Here"
                      style={{ width: '50%', height: '80%' }}
                      id="myInput"
                      onKeyUp={filterFunction}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '-20px',
                    marginBottom: '20px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showAlert ? <Alert message={alertText} type="success" showIcon /> : ''}
                </div>

                {loading2 === true ? (
                  <Skeleton active />
                ) : (
                  <UserTableStyleWrapper>
                    <TableWrapper className="table-responsive">
                      <Table
                        id="myTable"
                        columns={usersTableColumns}
                        scroll={{ x: true }}
                        dataSource={usersData}
                        pagination={{
                          showSizeChanger: true,
                          pageSizeOptions: ['10', '30', `${usersData.length}`],
                          defaultPageSize: 10,
                          total: usersData.length,
                          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        }}
                      />
                    </TableWrapper>
                  </UserTableStyleWrapper>
                )}
              </Cards>
            </ExportStyleWrap>
          </Col>
        </Row>
      </Main>
      <EditUser
        title="Edit User Status"
        wrapClassName="sDash_export-wrap"
        visible={isModalVisible2}
        footer={null}
        onCancel={handleCancel3}
        singleUser={singleUser}
        onAddEditUser={addEditUser}
      />
    </>
  );
};

export default AccountVerification;
