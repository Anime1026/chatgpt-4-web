import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { postRequest } from '../../service';

const socket = io(process.env.REACT_APP_BACKEND_BASE_URL as string);

const UserList = (props: any) => {
  const { mobileList } = props;
  const [userList, setUserList] = useState([]);

  const getUsers = async () => {
    await postRequest('/getAllUsers', {}).then((res: any) => {
      if (res.status) {
        let data = res.data.map((item: any) => {
          return { ...item, network: false };
        });
        setUserList(data);
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    socket.on('online users', async (e) => {
      let data: any = userList.map((item: any) => {
        return { ...item, network: false };
      });

      // eslint-disable-next-line
      Object.keys(e as { [key: string]: any }).map((key: string) => {
        const index = data.map((ele: any) => ele._id).indexOf(e[key]);
        data[index].network = true;
      });
      setUserList(data);
    });

    return () => {
      socket.off('online users');
    };
    // eslint-disable-next-line
  }, [userList]);

  return (
    <div className={`user-list ${mobileList ? 'show' : ''}`}>
      <div className={`user-group ${mobileList ? 'flex' : 'hidden'}`}>
        {userList.map((item: any, key: number) => {
          return (
            <div key={key} className="user-item">
              <div>
                <div className="user-avatar">
                  {item.first_name.slice(0, 1).toUpperCase() + item.last_name.slice(0, 1).toUpperCase()}
                </div>
                <p>{`${item.first_name} ${item.last_name}`}</p>
              </div>
              <span className={item.network ? 'bg-green' : 'bg-thick-gray'} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
