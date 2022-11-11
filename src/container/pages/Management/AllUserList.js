import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Input, Select, Alert, Skeleton, Form, Tooltip, Tag } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import { UserTableStyleWrapper } from '../style';
import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { getItem, setItem } from '../../../utility/localStorageControl';
import UserDetails from './UserDetails';
import { alertModal } from '../../../components/modals/antd-modals';
import MainCard from './MainCard';

const AllUserList = () => {
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
  const [state, setState] = useState({
    isModalVisible: false,
    fileName: 'frxnl',
    convertedTo: 'csv',
    selectedRowKeys: 0,
    selectedRows: [],
  });
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalLevel2: 0,
    totalLevel1: 0,
    totalKycPending: 0,
    totalUnverified: 0,
  });

  const showModal3 = () => {
    setIsModalVisible2(true);
  };
  const handleCancel3 = () => {
    getAllUsersData();
    setIsModalVisible2(false);
  };

  const showModal = () => {
    setState({
      ...state,
      isModalVisible: true,
    });
  };
  const handleCancel = () => {
    setState({
      ...state,
      isModalVisible: false,
    });
  };

  const csvData = [['name', 'email', 'phone', 'region', 'company', 'status']];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({ ...state, selectedRowKeys, selectedRows });
    },
  };

  state.selectedRows.map(users => {
    const { name, email, phone, region, company, status } = users;
    return csvData.push([name, email, phone.props.children, region, company, status]);
  });

  const { isModalVisible } = state;

  const warning = () => {
    alertModal.warning({
      title: 'Please Select Required Rows!',
    });
  };

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const xlsxExtension = '.xlsx';

  const exportToXLSX = (inputData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(inputData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + xlsxExtension);
    setState({
      ...state,
      isModalVisible: false,
    });
  };

  const updateFileName = e => {
    setState({
      ...state,
      fileName: e.target.value,
    });
  };
  const updateFileType = value => {
    setState({
      ...state,
      convertedTo: value,
    });
  };
  const { Option } = Select;
  const { fileName, convertedTo } = state;

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
    getAllUsersData();
  }, []);

  const fetchDataFromBubble = async cursor => {
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

  const getAllUsersData = async () => {
    let allRecords = [];
    let remainingPages = 1;
    let cursor = 0;
    while (remainingPages > 0) {
      const fetchedData = await fetchDataFromBubble(cursor);
      allRecords = [...allRecords, ...fetchedData['results']];
      cursor += fetchedData['count'];
      const remaining = fetchedData['remaining'];
      if (remaining != 0) {
        remainingPages = 1;
      } else {
        remainingPages = -1;
      }
    }
    let stats = {
      totalUsers: 0,
      totalLevel2: 0,
      totalLevel1: 0,
      totalKycPending: 0,
      totalUnverified: 0,
    };
    const users = allRecords.reverse();
    let usersTableData = [];
    users.map(user => {
      if (user['User type'] === 'client') {
        stats.totalUsers = stats.totalUsers + 1;
        if (user['Account verification (KYC)'] === 'Unverified') {
          stats.totalUnverified = stats.totalUnverified + 1;
        } else if (user['Account verification (KYC)'] === 'Level 1') {
          stats.totalLevel1 = stats.totalLevel1 + 1;
        } else if (user['Account verification (KYC)'] === 'Level 2') {
          stats.totalLevel2 = stats.totalLevel2 + 1;
        } else {
          stats.totalKycPending = stats.totalKycPending + 1;
        }
      }

      return usersTableData.push({
        key: user['_id'],
        email: user['authentication'].email.email,
        name: `${user['First Name'] ?? ''} ${user['Middle Name'] ?? ''} ${user['Last Name'] ?? ''}`,
        residence: user['Country Of Residence'] ? user['Country Of Residence'].address : '',
        joined:
          new Date(user['Created Date']).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) ??
          '',
        status: (
          <span className={`status ${user['Account verification (KYC)'] === 'Unverified' ? 'warning' : 'Success'}`}>
            {user['Account verification (KYC)'] ?? ''}
          </span>
        ),
        wallet: user['Peccala deposit address'] ?? '',
        action: (
          <div className="table-actions">
            <>
              {/* <Tooltip title="Delete User">
                <Button className="btn-icon" type="danger" shape="circle" onClick={() => wrongLeadStatus(user)}>
                  <FeatherIcon icon="trash" size={16} />
                </Button>
              </Tooltip> */}
              <Tooltip title="Update User">
                <Button
                  className="btn-icon"
                  type="info"
                  shape="circle"
                  onClick={() => {
                    showModal3();
                    setSingleUser(user);
                    setItem('currentUser', JSON.stringify(user));
                    history.push({
                      pathname: '/admin/user/details',
                      state: user,
                    });
                  }}
                >
                  <FeatherIcon icon="edit" size={16} />
                </Button>
              </Tooltip>
              <Tooltip title="View Details">
                <Button className="btn-icon" shape="circle" type="primary" onClick={() => details(user)}>
                  <FeatherIcon icon="eye" size={16} />
                </Button>
              </Tooltip>
            </>
          </div>
        ),
      });
    });
    setUserStats(stats);
    setUsersData(usersTableData);
    setReference(usersTableData);
    setLoading2(false);
  };

  const wrongLeadStatus = user => {
    if (confirm(`Are You Sure `)) {
      const jwtToken = getItem('jwt');
      const api = process.env.REACT_APP_BACKEND_API;
      const URL = `${api}users/update-user/${user._id}`;
      var config = {
        method: 'put',
        url: URL,
        headers: {
          'x-access-token': `${jwtToken.token}`,
        },
        data: {
          wrongLead: true,
        },
      };
      axios(config)
        .then(function(response) {
          setShowAlert(true);
          setAlertText(`User Successfully Updated`);
          setAlertType('success');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          getAllUsersData();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  const usersTableColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      sorter: (a, b) => {
        return a.email.toString().localeCompare(b.email.toString());
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      sorter: (a, b) => {
        return a.name.toString().localeCompare(b.name.toString());
      },
    },
    {
      title: 'Country',
      dataIndex: 'residence',
      key: 'residence',
      width: 200,
    },
    {
      title: 'Signup date',
      dataIndex: 'joined',
      key: 'joined',
      width: 200,
    },
    {
      title: 'Verification Level',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
    {
      title: 'Wallet Address',
      dataIndex: 'wallet',
      key: 'wallet',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 280,
    },
  ];

  const selectedFilter = e => {
    setShow(true);
    setSelectFilter(e);
  };

  const filterFunction = e => {
    var selectedFilter = selectFilter;
    var x = 1;
    if (selectedFilter === 'email') {
      x = 1;
    }
    if (selectedFilter === 'name') {
      x = 2;
    }
    if (selectedFilter === 'residence') {
      x = 3;
    }
    if (selectedFilter === 'joined') {
      x = 4;
    }
    if (selectedFilter === 'status') {
      x = 5;
    }

    if (x === 1) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.email.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 2) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.name.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 3) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.residence.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 4) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.joined.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 5) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.status.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
  };

  const addUser = () => {
    history.push('/admin/add');
  };

  const deleteUser = (id, name) => {
    if (confirm(`Are You Sure to Delete  ${name} User `)) {
      const jwtToken = getItem('jwt');
      const api = process.env.REACT_APP_BACKEND_API;
      const URL = `${api}users/delete-user/${id}`;
      var config = {
        method: 'delete',
        url: URL,
        headers: {
          'x-access-token': `${jwtToken.token}`,
        },
      };
      axios(config)
        .then(function(response) {
          setShowAlert(true);
          setAlertText(`User Successfully Deleted`);
          setAlertType('success');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          getAllUsersData();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  const details = user => {
    setSingleUser(user);
    setShowModal2(true);
  };

  const handleCancel2 = () => {
    setShowModal2(false);
  };

  const addEditUser = val => {
    setShowAlert(true);
    setAlertText(val);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      <PageHeader title="Admin Dashboard" />
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <MainCard userStats={userStats} isLoading={loading2} />
          </Col>
          <Col sm={24} xs={24}>
            <ExportStyleWrap>
              <Cards headless>
                <UserDetails
                  title="User Details"
                  wrapClassName="sDash_export-wrap"
                  visible={showModal2}
                  footer={null}
                  onCancel={handleCancel2}
                  singleUser={singleUser}
                />
                <div className="sDash_export-box" style={{ marginBottom: '20px' }}>
                  <div>
                    {state.selectedRows.length ? (
                      <>
                        <Button
                          className="btn-export"
                          onClick={showModal}
                          type="secondary"
                          style={{ marginLeft: '10px' }}
                        >
                          Export
                        </Button>
                        <Modal
                          title="Export File"
                          wrapClassName="sDash_export-wrap"
                          visible={isModalVisible}
                          footer={null}
                          onCancel={handleCancel}
                        >
                          <Form name="contact">
                            <Form.Item name="f_name">
                              <Input placeholder="File Name" value={fileName} onChange={updateFileName} />
                            </Form.Item>
                            <Form.Item name="f_type">
                              <Select defaultValue="CSV" onChange={updateFileType}>
                                <Option value="csv">CSV</Option>
                                <Option value="xlxs">xlxs</Option>
                              </Select>
                            </Form.Item>
                            <div className="sDash-button-grp">
                              {convertedTo === 'csv' ? (
                                <CSVLink filename={`${fileName}.csv`} data={csvData}>
                                  <Button onClick={handleCancel} className="btn-export" type="primary">
                                    Export
                                  </Button>
                                </CSVLink>
                              ) : (
                                <Button
                                  className="btn-export"
                                  onClick={() => exportToXLSX(csvData, fileName)}
                                  type="primary"
                                >
                                  Export
                                </Button>
                              )}
                              <Button htmlType="submit" onClick={handleCancel} size="default" type="white" outlined>
                                Cancel
                              </Button>
                            </div>
                          </Form>
                        </Modal>
                      </>
                    ) : (
                      <Button className="btn-export" onClick={warning} type="secondary" style={{ marginLeft: '10px' }}>
                        Export
                      </Button>
                    )}
                  </div>
                  <div>
                    <Select
                      // defaultValue="name"
                      placeholder="Search By"
                      style={{ marginRight: '10px' }}
                      onChange={selectedFilter}
                    >
                      <Select.Option value="email">Email</Select.Option>
                      <Select.Option value="name">Name</Select.Option>
                      <Select.Option value="residence">Country</Select.Option>
                      <Select.Option value="joined">Signup Date</Select.Option>
                      <Select.Option value="status">Verification Level</Select.Option>
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
                        rowSelection={rowSelection}
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
    </>
  );
};

export default AllUserList;
