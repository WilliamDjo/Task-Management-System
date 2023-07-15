import React from 'react';
import PropTypes from 'prop-types';

import SideBar from './SideBar';

const ProfileBar = (props) => {
  const back = {
    screenName: 'Profile',
    link: '/profile'
  }

  const tabs = [
    {
      screenName: 'Pending Tasks',
      link: '',
      active: props.pendingTasks
    }, {
      screenName: 'My Profile',
      link: '/profile/my',
      active: props.myProfile
    }, {
      screenName: 'Update Profile',
      link: '/profile/edit',
      active: props.updateProfile
    }, {
      screenName: 'Connections',
      link: '/connections',
      active: props.connections
    }
  ]
  return (
    <SideBar
      back={back}
      tabs={tabs}
    >
      {props.children}
    </SideBar>
  );
}

ProfileBar.propTypes = {
  children: PropTypes.element,
  pendingTasks: PropTypes.bool,
  myProfile: PropTypes.bool,
  updateProfile: PropTypes.bool,
  connections: PropTypes.bool
}

export default ProfileBar;
