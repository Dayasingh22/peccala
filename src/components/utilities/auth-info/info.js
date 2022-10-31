import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import { InfoWraper } from './auth-info-style';
import { logOut } from '../../../redux/authentication/actionCreator';

const AuthInfo = () => {
  const dispatch = useDispatch();

  const SignOut = e => {
    e.preventDefault();
    dispatch(logOut());
  };

  return (
    <InfoWraper>
      <div className="nav-author">
        <div className="user-dropdwon">
          <Tooltip title="Sign Out">
            <Link className="user-dropdwon__bottomAction" onClick={SignOut} to="#">
              <FeatherIcon icon="log-out" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </InfoWraper>
  );
};

export default AuthInfo;
