import React from 'react';
import { Menu } from 'antd';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import FeatherIcon from 'feather-icons-react';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/authentication/actionCreator';

const { SubMenu } = Menu;

const MenuItems = ({ darkMode, toggleCollapsed, topMenu, events }) => {
  const { path } = useRouteMatch();

  const pathName = window.location.pathname;
  const pathArray = pathName.split(path);
  const mainPath = pathArray[1];
  const mainPathSplit = mainPath.split('/');

  const { onRtlChange, onLtrChange, modeChangeDark, modeChangeLight, modeChangeTopNav, modeChangeSideNav } = events;
  const [openKeys, setOpenKeys] = React.useState(
    !topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : [],
  );

  const onOpenChange = keys => {
    setOpenKeys(keys[keys.length - 1] !== 'recharts' ? [keys.length && keys[keys.length - 1]] : keys);
  };

  const onClick = item => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  const dispatch = useDispatch();

  const SignOut = e => {
    dispatch(logOut());
  };

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? 'inline' : 'horizontal'}
      theme={darkMode && 'dark'}
      // // eslint-disable-next-line no-nested-ternary
      defaultSelectedKeys={
        !topMenu
          ? [
              `${
                mainPathSplit.length === 1 ? 'home' : mainPathSplit.length === 2 ? mainPathSplit[1] : mainPathSplit[2]
              }`,
            ]
          : []
      }
      defaultOpenKeys={!topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : []}
      overflowedIndicator={<FeatherIcon icon="more-vertical" />}
      openKeys={openKeys}
    >
      <Menu.Item
        icon={
          !topMenu && (
            <NavLink className="menuItem-iocn" to={`${path}/list`}>
              <FeatherIcon icon="users" />
            </NavLink>
          )
        }
        key="user"
      >
        <NavLink onClick={toggleCollapsed} to={`${path}/list`}>
          User Management
        </NavLink>
      </Menu.Item>
      <SubMenu key="management" icon={!topMenu && <FeatherIcon icon="inbox" />} title="KYC Management">
        <Menu.Item key="inbox">
          <NavLink onClick={toggleCollapsed} to={`${path}/verification`}>
            Account Verification
          </NavLink>
        </Menu.Item>
      </SubMenu>

      <Menu.Item
        icon={
          !topMenu && (
            <NavLink className="menuItem-iocn" to={`${path}/transactions`}>
              <FeatherIcon icon="list" />
            </NavLink>
          )
        }
        key="transaction"
      >
        <NavLink onClick={toggleCollapsed} to={`${path}/transactions`}>
          All Transactions
        </NavLink>
      </Menu.Item>

      <Menu.Item
        icon={
          !topMenu && (
            <NavLink className="menuItem-iocn" to="#">
              <FeatherIcon icon="activity" />
            </NavLink>
          )
        }
        key="report"
      >
        <NavLink onClick={toggleCollapsed} to="#">
          Triggers
        </NavLink>
      </Menu.Item>
      <Menu.Item
        onClick={SignOut}
        icon={
          !topMenu && (
            <NavLink className="menuItem-iocn" to="#">
              <FeatherIcon icon="log-out" />
            </NavLink>
          )
        }
        key="log-out"
      >
        <NavLink onClick={toggleCollapsed} to="#">
          Sign out
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};

MenuItems.propTypes = {
  darkMode: propTypes.bool,
  topMenu: propTypes.bool,
  toggleCollapsed: propTypes.func,
  events: propTypes.object,
};

export default MenuItems;
