import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider } from '@chakra-ui/react';
import { ChevronDownIcon, BellIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import axios from "axios";
import UserList from '../UserAvatar/UserList';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from '../../config/Chatslogic';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    //const { user, setSelectedChat } = useChatState();
    const {
        setSelectedChat,
        selectedChat,
        user,
        notificatin,
        setNotificatin,
        chats,
        setChats,
    } = useChatState();

    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.clear("userInfo");
        navigate('/');
    }


    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something in Search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            /*   const response = await axios.get(`http://localhost:4000/api/user?search=${search}`, {
                   headers: {
                       Authorization: `Bearer ${user.token}`
                   }
               });*/

            const response = await axios.get(`/api/user?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await response.data;
            //console.log(data);
            setSearchResult(data);
            // console.log(searchResult);
            setLoading(false);
        }
        catch (error) {
            toast({
                title: 'Error occured ',
                description: "Failed to load the Search Result",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
    }
    const accessChat = async (userId) => {
        // console.log(userId);
        //console.log("sideDrawer user", user);
        try {
            //setLoadingChat(true);
            /* const config = {
                 headers: {
                     //  "Content-type": "application/json",
                     Authorization: `Bearer ${user.token}`,
                 },
             };
             const { data } = await axios.post(`/api/chat`, { userId }, config);*/
            setLoadingChat(true);
            /*  const response = await axios.post(
                  "http://localhost:4000/api/chat",
                  { userID: userId },
                  {
                      headers: {
                          Authorization: `Bearer ${user.token}`
                      }
                  }
              );*/
            //const data = await response.json();
            const response = await axios.post(
                `/api/chat`,
                { userID: userId },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            const data = await response.data;
            //console.log("Data.....Side", data);
            //console.log("Chats", chats);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);   //////
            //console.log("Data of SideDrawer ", data);
            setSelectedChat(data);
            //console.log(selectedChat);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.response.data.msg,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    return (
        <>
            <Box
                display="flex" justifyContent="space-between" alignItems="center" width="100%" bg="transparent" filter="blur(0.5px)" border="1px solid black" p="5px 10px 5px 10px">
                <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}> <i className="fa-solid fa-magnifying-glass" style={{ color: "#000000" }}></i>
                        <Text display={{ base: "none", md: "flex" }} px="4" >Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontWeight="200" >TALK AND TALK</Text>

                <div className='menu-list'>
                    <Menu>
                        <MenuButton p="1">
                            <NotificationBadge
                                count={notificatin.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" margin="1" />
                        </MenuButton>

                        <MenuList pl={2}>
                            {!notificatin.length && "No New Messages"}
                            {notificatin.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotificatin(notificatin.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>

                    </Menu>

                    <Menu  >
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} style={{ background: "transparent" }}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList >
                            <ProfileModal user={user}>
                                <MenuItem>My Profile </MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >


            <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display="flex" pb="2">
                            <Input placeholder='Search by name or Email' mr="2" value={search} onChange={(e) => { setSearch(e.target.value) }}></Input>
                            <Button onClick={handleSearch}>GO</Button>
                        </Box>

                        {loading ? (<ChatLoading />) : (
                            searchResult.map(user => {
                                return <UserList key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                            })
                        )}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>

                    </DrawerFooter>

                    {loadingChat && <Spinner ml="auto" d="flex" />}
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer