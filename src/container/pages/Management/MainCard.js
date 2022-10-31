import React from 'react';
import { PerformanceChartWrapper, Pstates } from './style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import Heading from '../../../components/heading/heading';
import { Spin } from 'antd';

const UserPopUpCard = ({ userStats, isLoading }) => {
  return (
    <PerformanceChartWrapper>
      <Cards title="Users Data" size="large">
        <Pstates>
          <div className={`growth-upward`} role="button" onKeyPress={() => {}} tabIndex="0">
            <p>No of Users</p>
            <Heading as="h1">{isLoading ? <Spin /> : userStats.totalUsers}</Heading>
          </div>
          <div className={`growth-upward`} role="button" onKeyPress={() => {}} tabIndex="0">
            <p>Level 2 Users</p>
            <Heading as="h1">{isLoading ? <Spin /> : userStats.totalLevel2}</Heading>
          </div>
          <div className={`growth-downward`} role="button" onKeyPress={() => {}} tabIndex="0">
            <p>Level 1 Users</p>
            <Heading as="h1">{isLoading ? <Spin /> : userStats.totalLevel1}</Heading>
          </div>
          <div className={`growth-upward`} role="button" onKeyPress={() => {}} tabIndex="0">
            <p>KYC Pending Users</p>
            <Heading as="h1">{isLoading ? <Spin /> : userStats.totalKycPending}</Heading>
          </div>
          <div className={`growth-upward`} role="button" onKeyPress={() => {}} tabIndex="0">
            <p>Unverified Users</p>
            <Heading as="h1">{isLoading ? <Spin /> : userStats.totalUnverified}</Heading>
          </div>
        </Pstates>
      </Cards>
    </PerformanceChartWrapper>
  );
};

export default UserPopUpCard;
