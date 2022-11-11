import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Table, Modal, Skeleton, Tooltip, Tag, Alert } from 'antd';
import { AccountWrapper } from './style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import Heading from '../../../components/heading/heading';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import axios from 'axios';
import FeatherIcon from 'feather-icons-react';
import { UserTableStyleWrapper } from '../style';
import { getItem } from '../../../utility/localStorageControl';
import UserTransactionDetails from './user/overview/UserTransactionDetails';

const Account = ({ usersData }) => {
  const { Column } = Table;
  const [userInfo, setUserInfo] = useState(null);
  const [showModal2, setShowModal2] = useState(false);

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
    <>
      {usersData.length > 0 ? (
        <Col sm={24} xs={24}>
          <ExportStyleWrap>
            <Cards headless>
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
            </Cards>
          </ExportStyleWrap>
        </Col>
      ) : (
        <Cards headless>
          <Alert message="No Transactions available for this user" type="info" showIcon />
        </Cards>
      )}
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
