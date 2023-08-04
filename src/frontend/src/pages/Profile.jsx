import React from 'react';

import OptionsScreen from '../components/OptionsScreen';

// The profile options screen, implements the OptionsScreen component with links to MyAssignedTasks, MyProfile, EditAccount and
// Connections screens.
const Profile = () => {
  const tabs = [
    {
      screenName: 'Assigned Tasks',
      link: '/profile/assigned'
    }, {
      screenName: 'My Profile',
      link: '/profile/my',
    },
    {
      screenName: 'Update Profile',
      link: '/profile/edit',
    },
    {
      screenName: 'Connections',
      link: '/connections',
    },
  ];

  return <OptionsScreen tabs={tabs} heading="Profile" />;
};

export default Profile;
