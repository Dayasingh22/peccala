import React, { lazy, Suspense } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { Switch, Route, Redirect } from 'react-router-dom';
import propTypes from 'prop-types';
import { SettingWrapper } from './overview/style';
import { PageHeader } from '../../../../components/page-headers/page-headers';
import { Main } from '../../../styled';
import { Cards } from '../../../../components/cards/frame/cards-frame';

const UserAccountDetails = lazy(() => import('./overview/UserAccountDetails'));
const UserTransactions = lazy(() => import('./overview/UserTransactions'));
const Sidebar = lazy(() => import('./overview/Sidebar'));

const SingleUser = ({ match }) => {
  const { path } = match;

  const RedirectToDetails = () => {
    return <Redirect to={`${path}/details`} />;
  };

  return (
    <>
      <PageHeader ghost title="User Details" />
      <Main>
        <Row gutter={25}>
          <Col xxl={6} lg={6} md={10} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton avatar />
                </Cards>
              }
            >
              <Sidebar />
            </Suspense>
          </Col>
          <Col xxl={18} lg={18} md={14} xs={24}>
            <SettingWrapper>
              <Switch>
                <Suspense
                  fallback={
                    <Cards headless>
                      <Skeleton paragraph={{ rows: 20 }} />
                    </Cards>
                  }
                >
                  <Route exact path={`${path}`} component={RedirectToDetails} />
                  <Route exact path={`${path}/details`} component={UserAccountDetails} />
                  <Route exact path={`${path}/transactions`} component={UserTransactions} />
                </Suspense>
              </Switch>
            </SettingWrapper>
          </Col>
        </Row>
      </Main>
    </>
  );
};

SingleUser.propTypes = {
  match: propTypes.object,
};

export default SingleUser;
