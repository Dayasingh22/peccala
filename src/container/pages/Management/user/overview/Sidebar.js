import React from 'react';
import { Upload } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';
import propTypes from 'prop-types';
import { ProfileAuthorBox } from './style';
import Heading from '../../../../../components/heading/heading';
import { Cards } from '../../../../../components/cards/frame/cards-frame';

const AuthorBox = () => {
  const { path } = useRouteMatch();

  return (
    <ProfileAuthorBox>
      <Cards headless>
        <nav className="settings-menmulist">
          <ul>
            <li>
              <NavLink to={`${path}/details`}>
                <FeatherIcon icon="user" size={14} />
                Edit User Details
              </NavLink>
            </li>
            <li>
              <NavLink to={`${path}/transactions`}>
                <FeatherIcon icon="shuffle" size={14} />
                User Transactions
              </NavLink>
            </li>
          </ul>
        </nav>
      </Cards>
    </ProfileAuthorBox>
  );
};

AuthorBox.propTypes = {
  match: propTypes.object,
};

export default AuthorBox;
