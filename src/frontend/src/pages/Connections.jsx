import React from 'react';

import OptionsScreen from '../components/OptionsScreen';

const Connections = () => {
  const tabs = [
    {
      screenName: 'My Connections',
      link: '/connections/my'
    }, {
      screenName: 'Add Connection',
      link: '/connections/add'
    }, {
      screenName: 'Pending Connections',
      link: '/connections/pending'
    }
  ];
  return (
    <OptionsScreen tabs={tabs} heading='Connections' />
  );
}

export default Connections;
