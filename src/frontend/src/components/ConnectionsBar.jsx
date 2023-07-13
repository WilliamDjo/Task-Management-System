import PropTypes from 'prop-types';
import React from 'react';

import SideBar from './SideBar';

const ConnectionsBar = (props) => {
  const back = {
    screenName: 'Connections',
    link: '/connections',
  };

  const tabs = [
    {
      screenName: 'My Connections',
      link: '/connections/my',
      active: props.myConnections
    }, {
      screenName: 'Add Connections',
      link: '/connections/add',
      active: props.addConnections
    }, {
      screenName: 'Pending Connections',
      link: '/connections/pending',
      active: props.pendingConnections
    },
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

ConnectionsBar.propTypes = {
  children: PropTypes.element,
  myConnections: PropTypes.bool,
  addConnections: PropTypes.bool,
  pendingConnections: PropTypes.bool,
}

export default ConnectionsBar;
