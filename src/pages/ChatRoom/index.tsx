import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import IconMenu from '../../components/Icons';
import { MSGTypeInterface } from '../../type';
import AIImg from '../../assets/images/openai.png';
import { postRequest } from '../../service';
import { toast } from '../../components/Toast';
import useStore from '../../useStore';
import { getUserInfo } from '../../utils';

const socket = io(process.env.REACT_APP_BACKEND_BASE_URL as string);

const ChatRoom = () => {
  const { token } = useStore();
  const [user] = useState<any>(getUserInfo(token));
  const messagesEndRef: React.MutableRefObject<any> = useRef(null);
  const inputRef: React.MutableRefObject<any> = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [allMsg, setAllMsg] = useState<MSGTypeInterface[]>([]);
  const [openTools, setOpenTools] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  const handleKeyDown = async (e: any) => {
    if (!e.shiftKey && e.keyCode === 13) {
      if (!isLoading) {
        setIsLoading(true);
        await sendChatting();
      }
    }
  };
  const handleKeyUp = async (e: any) => {
    if (!e.shiftKey && e.keyCode === 13) {
      setMsg('');
      inputRef.current.focus();
    }
  };
  const sendChatting = async () => {
    if (!msg) return;
    const data: MSGTypeInterface = {
      from: user.user_id,
      to: 'chatgpt',
      message: msg.split('\n'),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_name: user.user_name,
      avatar: user.avatar,
      date: new Date()
    };
    setAllMsg((prev) => [...prev, data]);
    socket.emit('sent message to server', data);
    setIsLoading(false);
  };

  const removeHistory = async () => {
    postRequest('/clearHistory', { email: user.email }).then((res: any) => {
      if (res.status) {
        toast.success('Successfully remove your chat histories');
        setOpenTools(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  useEffect(() => {
    socket.on('connect', async () => {
      const data = {
        user_id: user.user_id,
        group: user.group
      };
      /* ---------------join in rooms--------------- */
      socket.emit('join room', data);
    });

    socket.on('group', (e) => {
      setAllMsg((prev) => [...prev, e]);
    });

    socket.on('chatgpt', (e) => {
      setAllMsg((prev) => [...prev, e]);
    });

    return () => {
      socket.off('connect');
      socket.off('chatgpt');
      socket.off('group');
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [allMsg]);

  return (
    <div className="chatroom">
      <div className="chatroom-header">
        <div className="chatroom-element-info">
          <h4>ChatGPT</h4>
          <p>bot</p>
        </div>
        <div className="chatroom-right">
          <div
            className={`chatroom-tool ${openTools ? 'active' : ''}`}
            onClick={() => {
              setOpenTools(!openTools);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          {openTools && (
            <div className="chatroom-tool-modal">
              <div
                className="item"
                onClick={() => {
                  removeHistory();
                }}
              >
                Clear My History
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="chatroom-body">
        <div className="chatroom-msg-content">
          <div className="chatroom-msg-group">
            {allMsg.map((item: MSGTypeInterface, ind1: number) => {
              return (
                <div key={ind1} className={item.from === user.user_id ? 'justify-end' : 'justify-start'}>
                  {item.from !== user.user_id && (
                    <div className="user-detail">
                      {item.user_name === 'GPT' ? (
                        <img src={AIImg} alt="avatar" />
                      ) : (
                        <>
                          {item.avatar ? <img src={item.avatar} alt="avatar" /> : <p>{item.user_name.slice(0, 1)}</p>}
                        </>
                      )}
                    </div>
                  )}
                  <div className={`messages ${item.from === user.user_id ? 'bg-forth' : 'bg-second'}`}>
                    <span className="inline">{`[${item.first_name.slice(0, 1).toUpperCase()}] : `}</span>
                    {item.message.map((ele: string, ind2: number) => {
                      return (
                        <p className="inline" key={ind1 + ind2}>
                          {ele}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="chatroom-typing-content">
          <button className="type-controller">
            <IconMenu icon="Attach" size={22} height={30} />
          </button>
          <textarea
            ref={inputRef}
            placeholder="Write a message..."
            value={msg}
            onKeyDown={(e: any) => handleKeyDown(e)}
            onKeyUp={(e: any) => handleKeyUp(e)}
            onChange={(e: any) => setMsg(e.target.value)}
          />
          <button className="type-controller">
            <IconMenu icon="Send" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
