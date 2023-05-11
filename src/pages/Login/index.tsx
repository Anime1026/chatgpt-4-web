import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import Zoom from 'react-reveal/Zoom';
import { io } from 'socket.io-client';
import { BeatLoader } from 'react-spinners';
import Input from '../../components/Input';
import IconMenu from '../../components/Icons';
import Validator from '../../components/Validator';
import { toast } from '../../components/Toast';
import useStore from '../../useStore';
import { emailValidator, checkValidator, passwordView, getUserInfo } from '../../utils';
import { postRequest } from '../../service';

const socket = io(process.env.REACT_APP_BACKEND_BASE_URL as string);

const Login = () => {
  /* common variable */
  const navigate = useNavigate();
  const { update, updateSession } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  /* variables for login user */
  const loginInitialize = {
    email: {
      type: 'email',
      label: 'Email',
      icon: 'Email',
      value: '',
      message: ''
    },
    password: {
      type: 'password',
      label: 'Password',
      icon: 'Password',
      value: '',
      message: ''
    }
  };
  const [isKeep, setIsKeep] = useState(false);
  const [userData, setUserData] = useState<{ [key: string]: any }>(loginInitialize);

  /* common function */
  const setData = (ele: string, value: string, label: string) => {
    setUserData({
      ...userData,
      [ele]: {
        ...userData[ele],
        value: value,
        message: !value ? `${label} is required!` : ele === 'email' && emailValidator(value).msg
      }
    });
  };
  /* login function */
  const login = () => {
    if (!isLoading) {
      if (!emailValidator(userData.email.value).status) {
        toast.warning(emailValidator(userData.email.value).msg);
        return;
      }

      if (!userData.password.value) {
        toast.warning('Password is required!');
        return;
      }

      const data = {
        email: userData.email.value,
        password: userData.password.value
      };

      // setIsLoading(true);
      postRequest(`/login`, data).then((res: any) => {
        if (res.status) {
          toast.success(res.message);
          isKeep ? update({ token: res.token }) : updateSession({ token: res.token });
          let user: any = getUserInfo(res.token);
          const data = {
            user_id: user.user_id,
            group: user.group
          };
          socket.emit('join room', data);
          navigate('/user/chatting');
        } else {
          toast.error(res.message);
        }
        setIsLoading(false);
      });
    }
  };

  return (
    <Zoom top>
      <div className="auth-container">
        <div className="auth-form">
          <div className="flex flex-col gap-[20px]">
            <h2 className="font-BalsamiqSans">Sign In</h2>
            <div className="form-control">
              {Object.keys(userData).map((key: string, ind: number) => {
                return (
                  <div key={ind}>
                    <div className="form-element">
                      <Input
                        type={userData[key].type}
                        label={userData[key].label}
                        icon={userData[key].icon}
                        value={userData[key].value}
                        onBlur={() =>
                          setUserData(checkValidator(userData, key, userData[key].value, userData[key].label))
                        }
                        onChange={(e: any) => setData(key, e.target.value, userData[key].label)}
                      />
                      {key === 'password' && (
                        <div
                          className="flex items-center"
                          onClick={() => setUserData(passwordView(userData, key, userData[key].type))}
                        >
                          <IconMenu
                            icon={userData[key].type === 'password' ? 'Eye' : 'NoEye'}
                            size={20}
                            className="text-blue absolute top-[35%] right-[30px] cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    <Validator message={userData[key].message} />
                  </div>
                );
              })}
              <div className="logged-in">
                <input
                  type="checkbox"
                  name="logged"
                  readOnly
                  checked={isKeep}
                  onClick={() => (isKeep ? setIsKeep(false) : setIsKeep(true))}
                />
                <label htmlFor="logged">Keep me logged in</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <button className="btn-primary !rounded-full" disabled={isLoading} onClick={login}>
              {isLoading ? <BeatLoader color="#fff" size={10} /> : 'Sign In'}
            </button>
            <p className="redirect-other">
              <span>Don’t have an account?</span>
              <Link to="/register" className="cursor-pointer hover:text-blue hover:underline">
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Zoom>
  );
};

export default Login;
