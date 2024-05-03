import React from 'react'
//import { useChatState } from '../../Context/ChatProvider'
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserList = ({ user, handleFunction }) => {

    return (
        <div>
            <Box
                onClick={handleFunction}
                bg="#E8E8E8"
                cursor="pointer"
                _hover={{
                    background: "purple",
                    color: "white"
                }}
                width="100%"
                display="flex"
                alignItems="center"
                color="black"
                px="3"
                py="2"
                mb="2"
                borderRadius="lg"
            >
                <Avatar size='sm'
                    mr="2"
                    name={user.name}
                    src={user.pic}></Avatar>
                <Text >{user.name}</Text>
                <Text fontSize="xs">
                    <b> Email: </b>
                    {user.email}</Text>
            </Box>
        </div>
    )
}

export default UserList