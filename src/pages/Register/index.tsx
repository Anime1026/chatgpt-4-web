import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import Zoom from 'react-reveal/Zoom';
import { BeatLoader } from 'react-spinners';
import Input from '../../components/Input';
import IconMenu from '../../components/Icons';
import Validator from '../../components/Validator';
import { toast } from '../../components/Toast';
import { emailValidator, strongPasswordValidator, checkValidator, passwordView } from '../../utils';
import { postRequest } from '../../service';

const Register = () => {
  /* common variable */
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [smallMobile, setSmallMobile] = useState(false);
  /* variables for register user */
  const registerInitialize = {
    firstName: {
      type: 'text',
      label: 'First Name',
      icon: 'User',
      value: '',
      message: ''
    },
    lastName: {
      type: 'text',
      label: 'Last Name',
      icon: 'User',
      value: '',
      message: ''
    },
    email: {
      type: 'email',
      label: 'Email',
      icon: 'Email',
      value: '',
      message: ''
    },
    userName: {
      type: 'text',
      label: 'UserName',
      icon: 'User',
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
  const [userData, setUserData] = useState<{ [key: string]: any }>(registerInitialize);

  /* common function */
  const setData = (ele: string, value: string, label: string) => {
    setUserData({
      ...userData,
      [ele]: {
        ...userData[ele],
        value: value,
        message: !value
          ? `${label} is required!`
          : ele === 'email'
          ? emailValidator(value).msg
          : ele === 'password' && strongPasswordValidator(value).msg
      }
    });
  };
  /* register function */
  const register = () => {
    if (!isLoading) {
      if (!userData.firstName.value) {
        toast.warning('First Name is required!');
        return;
      }

      if (!userData.lastName.value) {
        toast.warning('Last Name is required!');
        return;
      }

      if (!emailValidator(userData.email.value).status) {
        toast.warning(emailValidator(userData.email.value).msg);
        return;
      }

      if (!userData.userName.value) {
        toast.warning('Email is required!');
        return;
      }

      if (!strongPasswordValidator(userData.password.value).status) {
        toast.warning(strongPasswordValidator(userData.password.value).msg);
        return;
      }

      setIsLoading(true);
      const data = {
        first_name: userData.firstName.value,
        last_name: userData.lastName.value,
        email: userData.email.value,
        user_name: userData.userName.value,
        password: userData.password.value,
        group: ['chatgpt'],
        permission: 'user'
      };

      postRequest(`/register`, data).then((res: any) => {
        if (res.status) {
          toast.success(res.message);
          setUserData(registerInitialize);
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        } else {
          toast.error(res.message);
        }
        setIsLoading(false);
      });
    }
  };

  const getHeight = () => {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  };

  useEffect(() => {
    const setResponsiveness = () => {
      if (getHeight() < 480) {
        setSmallMobile(true);
      } else {
        setSmallMobile(false);
      }
    };
    setResponsiveness();
    window.addEventListener('resize', setResponsiveness);
    // eslint-disable-next-line
  }, []);

  return (
    <Zoom top>
      <div className="auth-container">
        <div className={`auth-form ${smallMobile ? 'max-h-[400px]' : 'max-h-[600px] xs:max-h-[800px]'}`}>
          <div className="flex flex-col gap-[20px]">
            <h2 className="font-BalsamiqSans">Sign up</h2>
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
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <button className="btn-primary !rounded-full" disabled={isLoading} onClick={register}>
              {isLoading ? <BeatLoader color="#fff" size={10} /> : 'Sign Up'}
            </button>
            <p className="redirect-other">
              <span>Already have an account?</span>
              <Link to="/login" className="cursor-pointer hover:text-blue hover:underline">
                Sign In Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Zoom>
  );
};

export default Register;
