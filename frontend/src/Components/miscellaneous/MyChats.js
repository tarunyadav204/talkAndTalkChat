import React, { useState, useEffect } from 'react'
import { useChatState } from '../../Context/ChatProvider';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { getSender } from '../../config/Chatslogic';
import { Avatar, Button } from "@chakra-ui/react";
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import GroupChatModel from './GroupChatModel';
const MyChats = ({ fetchAgain }) => {
    const toast = useToast();
    const [loggedUser, setLoggedUser] = useState("");
    const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = useChatState();

    // console.log(selectedChat);
    //console.log(chats);
    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // const { data } = await axios.get("http://localhost:4000/api/chat", config);
            const { data } = await axios.get(`/api/chat`, config);

            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);



    return (
        <>
            <Box
                display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                flexDirection="column"
                alignItems="center"
                padding={3}
                //bg="lightblue"
                bg={"transparent"}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 5px 15px"
                width={{ base: "100%", md: "31%" }}
                // height={"100vh"}  //baad mai kiya hai check karna hai 
                borderRadius="lg"
            //borderWidth="1px"
            >

                <Box
                    pb={3}
                    px={3}
                    fontSize={{ base: "20px", md: "30px" }}
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center">
                    My Chats
                    <GroupChatModel>
                        <Button

                            display="flex"
                            background="black"
                            color="white"
                            _hover={{ color: "black", background: "white" }}
                            fontSize={{ base: "16px", md: "10px", lg: "16px" }}
                            rightIcon={<AddIcon />}
                        >
                            New Group Chat
                        </Button>
                    </GroupChatModel>
                </Box>

                <Box display="flex"
                    flexDirection="column"
                    p={3}
                    bg="#F8F8F8"
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflowY="hidden"

                >
                    {chats ? (
                        <Stack overflowY="scroll">
                            {chats.map(chat => {
                                return <Box onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"

                                    key={chat._id}>

                                    <Text>{!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}</Text>
                                </Box>
                            })}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )}
                </Box>


            </Box>
        </>
    );


}



export default MyChats