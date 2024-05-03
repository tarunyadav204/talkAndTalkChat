import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState("");  //change
    const [selectedChat, setSelectedChat] = useState("");
    const [chats, setChats] = useState([]);
    const [notificatin, setNotificatin] = useState([]);
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notificatin, setNotificatin }}>
            {children}
        </ChatContext.Provider>
    );
};

const useChatState = () => {
    return useContext(ChatContext);
};

export { ChatProvider, useChatState };
