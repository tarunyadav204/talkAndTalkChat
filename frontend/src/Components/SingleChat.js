import React, { useEffect, useState, useMemo } from 'react'
import "./style.css"
import { useChatState } from '../Context/ChatProvider'
import { Box, FormControl, Input, Spinner, Text, background } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton } from '@chakra-ui/react';
import { getSender, getSenderFull } from '../config/Chatslogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import ScroableChat from './ScroableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json"
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const { selectedChat, setSelectedChat, user, notificatin, setNotificatin } = useChatState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    //const ENDPOINT = "http://localhost:4000"; // 
    const socket = useMemo(() => io("http://localhost:4000"), []);
    // var socket;
    var selectedChatCompare;

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);

        }
        catch (error) {
            //console.log("Error : ", error);
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                setNewMessage("");
                const { data } = await axios.post(`/api/message`, { content: newMessage, chatId: selectedChat._id }, config);

                socket.emit("new message", data);
                //setMessages([...messages, data]);
                setMessages((prevMessages) => [...prevMessages, data]);

            }
            catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }

        }
    };

    useEffect(() => {
        //socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    //console.log("notifications.........", notificatin);

    useEffect(() => {

        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notificatin.includes(newMessageRecieved)) {
                    setNotificatin([...notificatin, newMessageRecieved]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                //setMessages([...messages, newMessageRecieved]);
                setMessages((prevMsg) => [...prevMsg, newMessageRecieved]);
            }
        });



    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        //typing indicator logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 2000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var diffTime = timeNow - lastTypingTime;

            if (diffTime > timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            width="30px"
                            height="30px"
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (<>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>) : (<>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                        </>)}
                    </Text>

                    <Box display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        p={3}
                        //bg="#E8E8E8"
                        bg={"transparent"}
                        width="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden">
                        {loading ? (<>
                            <Spinner size="xl"
                                width={20}
                                height={20}
                                alignSelf="center"
                                margin="auto" />
                        </>) : (
                            <div className='messages'>
                                <ScroableChat messages={messages} />
                            </div>
                        )}

                        {isTyping ? (<div>
                            <Lottie
                                options={defaultOptions}
                                width={100}
                                style={{ marginBottom: 15, marginLeft: 0 }}
                            />

                        </div>) : (<></>)}

                        <FormControl onKeyDown={sendMessage} isRequired mt="3">
                            <Input variant="filled"
                                //bg="#E0E0E0"
                                //bg="linear-gradient(135deg, #4203a9, #90bafc)"
                                bg={"lightblue"}
                                fontSize={"20px"}
                                _focus={{ background: "lightgreen", border: "none" }}
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            >

                            </Input>
                        </FormControl>

                    </Box>
                </>
            )
                : (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%">
                        <Text fontSize="3xl" pb={3} >
                            Click on a user to start chatting
                        </Text >
                    </Box >
                )}
        </>
    )
}

export default SingleChat