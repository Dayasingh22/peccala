import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Table, Modal, Skeleton, Tooltip, Tag, Alert } from 'antd';
import { AccountWrapper } from './style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import Heading from '../../../components/heading/heading';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import axios from 'axios';
import FeatherIcon from 'feather-icons-react';
import { UserTableStyleWrapper, GalleryNav } from '../style';
import { getItem } from '../../../utility/localStorageControl';
import UserTransactionDetails from './user/overview/UserTransactionDetails';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Link } from 'react-router-dom';
import SingleTransactionType from './SingleTransactionType';

const Account = () => {
  const { Column } = Table;
  const [usersData, setUsersData] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal2, setShowModal2] = useState(false);
  const [singleUser, setSingleUser] = useState(null);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [reference, setReference] = useState([]);

  useEffect(() => {
    const singleUser = getItem('currentUser');
    setUserInfo(singleUser);
    getUserTransactions();
  }, []);

  const fetchUserDataFromBubble = async () => {
    const token = process.env.REACT_APP_PECCALA_TOKEN;
    const uid = {
      uid: 'all',
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

  const getUserTransactions = async () => {
    let allRecords = [];
    const fetchedData = await fetchUserDataFromBubble();
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
      setReference(transactionsRecords);
      setDataAvailable(true);
    }

    setLoading2(false);
  };

  const handleCancel2 = () => {
    setShowModal2(false);
  };

  const [state, setState] = useState({
    activeClass: '',
  });

  const handleChange = value => {
    const filteredData = reference.filter(entry => entry.action.includes(value));
    console.log('bgfbfg', filteredData);
    setUsersData(filteredData);
    setState({
      ...state,
      activeClass: value,
    });
  };

  return (
    <>
      <PageHeader title="All Transactions" />
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <GalleryNav>
              <ul>
                <li>
                  <Link
                    className={state.activeClass === '' ? 'active' : 'deactivate'}
                    onClick={() => handleChange('')}
                    to="#"
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    className={state.activeClass === 'DEPOSIT' ? 'active' : 'deactivate'}
                    onClick={() => handleChange('DEPOSIT')}
                    to="#"
                  >
                    Deposits
                  </Link>
                </li>
                <li>
                  <Link
                    className={state.activeClass === 'WITHDRAW' ? 'active' : 'deactivate'}
                    onClick={() => handleChange('WITHDRAW')}
                    to="#"
                  >
                    Withdrawals
                  </Link>
                </li>
                <li>
                  <Link
                    className={state.activeClass === 'BUY' ? 'active' : 'deactivate'}
                    onClick={() => handleChange('BUY')}
                    to="#"
                  >
                    Buy Orders
                  </Link>
                </li>
                <li>
                  <Link
                    className={state.activeClass === 'SELL' ? 'active' : 'deactivate'}
                    onClick={() => handleChange('SELL')}
                    to="#"
                  >
                    Sell Orders
                  </Link>
                </li>
                <li>
                  <Link
                    className={state.activeClass === 'FEE' ? 'active' : 'deactivate'}
                    onClick={() => handleChange('FEE')}
                    to="#"
                  >
                    Performance Fee
                  </Link>
                </li>
              </ul>
            </GalleryNav>
          </Col>
          {loading2 ? (
            <Col xs={24}>
              <Cards headless>
                <Skeleton active />
              </Cards>
            </Col>
          ) : dataAvailable ? (
            <SingleTransactionType usersData={usersData} />
          ) : (
            <Alert message="No Transactions available for this user" type="info" showIcon />
          )}
        </Row>
      </Main>
      <UserTransactionDetails
        title="User Transaction Details"
        wrapClassName="sDash_export-wrap"
        visible={showModal2}
        footer={null}
        onCancel={handleCancel2}
        singleTransaction={userInfo}
      />
    </>
  );
};

export default Account;
