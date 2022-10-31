import React, { lazy, Suspense } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import withAdminLayout from '../../layout/withAdminLayout';
import { Spin } from 'antd';

const NotFound = lazy(() => import('../../container/pages/404'));
const AllUserList = lazy(() => import('../../container/pages/Management/AllUserList'));
const EditUser = lazy(() => import('../../container/pages/Management/EditUser'));
const UserDetails = lazy(() => import('../../container/pages/Management/user/SingleUser'));
const AccountVerification = lazy(() => import('../../container/pages/Management/AccountVerification'));

const Admin = () => {
  const { path } = useRouteMatch();

  const RedirectToUserPage = () => {
    return <Redirect to={`${path}/list`} />;
  };

  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route path={`${path}/404`} component={NotFound} />
        <Route path={path} exact component={RedirectToUserPage} />
        <Route path={`${path}/list`} component={AllUserList} />
        <Route path={`${path}/edituser/:id`} component={EditUser} />
        <Route path={`${path}/user`} component={UserDetails} />
        <Route path={`${path}/verification`} component={AccountVerification} />
      </Suspense>
    </Switch>
  );
};

export default withAdminLayout(Admin);
