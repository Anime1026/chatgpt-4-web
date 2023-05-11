import React from 'react';
import IconMenu from '../../components/Icons';

const UserSidebar = (props: any) => {
  return (
    <div className="user-sidebar">
      <button className="hamburger-button" onClick={() => props.setOpen(!props.open)}>
        <IconMenu icon="Hamburger" size={24} height={20} />
      </button>
      <div className="user-setting-list"></div>
    </div>
  );
};

export default UserSidebar;
