import { Box } from '@chakra-ui/react'
import "../style.css"
import React from 'react'
import { useChatState } from '../../Context/ChatProvider'
import SingleChat from '../SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

    const { selectedChat } = useChatState();
    return (
        <div className='chatBox'>
            <Box

                display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
                alignItems="center"
                flexDirection="column"
                flexWrap="wrap"
                p={3}
                bg="transparent"
                width={{ base: "100%", md: "68%" }}
                //width={{ base: "100%" }}
                borderRadius="lg"
                // width="800px"

                //borderWidth="1px"
                boxShadow="rgba(0, 0, 0, 0.5) 0px 5px 15px"
            >
                <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Box>
        </div>
    )
}

export default ChatBox