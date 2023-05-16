import React from 'react';
import hamburger from "../../assets/images/hamburger.png";

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
        <img src={hamburger} width={22} height={20} alt='hamburger'></img>
      </button>
      <div className="user-setting-list"></div>
    </div>
  );
};

export default UserSidebar;
