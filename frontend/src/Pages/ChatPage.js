
import React from 'react';
import { useChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/miscellaneous/SideDrawer';
import MyChats from '../Components/miscellaneous/MyChats';
import ChatBox from '../Components/miscellaneous/ChatBox';
import { useState } from 'react';
const ChatPage = () => {
    const { user } = useChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}

            <Box
                display="flex"
                justifyContent="space-around"
                //justifyContent={"space-between"}
                gap={"5%"}
                width="100%"

                height="91.5vh"
                padding="10px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>


    );
}

export default ChatPage;


