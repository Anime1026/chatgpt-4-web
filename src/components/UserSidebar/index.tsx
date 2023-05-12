import React from 'react';
import IconMenu from '../../components/Icons';

const UserSidebar = (props: any) => {
  const getWidth = () => {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  };

  React.useEffect(() => {
    const setResponsiveness = () => {
      getWidth() > 1024 && props.setOpen(true);
    };
    setResponsiveness();
    window.addEventListener('resize', setResponsiveness);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="user-sidebar">
      <button className="hamburger-button" onClick={() => getWidth() < 1024 && props.setOpen(!props.open)}>
        <IconMenu icon="Hamburger" size={22} height={20} />
      </button>
      <div className="user-setting-list"></div>
    </div>
  );
};

export default UserSidebar;
