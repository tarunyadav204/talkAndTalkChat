import React, { useEffect } from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import LogIn from '../Components/LogIn/LogIn'
import SignUp from '../Components/SignUp/SignUp'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("userInfo");
        if (user) {
            navigate('/chats');
        }
    }, [navigate]);
    return (

        <Container maxW='xl' centerContent>

            <Box
                d='flex'
                justifyContent='center'

                p={3}
                background={'#8CBEE4'}
                width={'100%'}
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
                border='1px solid grey'
                bg='transparent'
                filter='blur(0.5px)'
                text-shadow='#FC0 1px 0 10px'
            >
                <Text fontSize='4xl' filter='blur(1px)'
                    textAlign='center' fontWeight='100'>Talk And Talk</Text>
            </Box>

            <Box // background='#8a82ee'
                style={{ border: "none" }}
                backdrop-filter=' blur(1px)'
                width='100%'
                p={4}
                borderRadius='lg'
                borderWidth='1px'>

                <Tabs variant='soft-rounded' color={"black"} >
                    <TabList w='100%' display='flex' justifyContent='space-around' marginBottom='1em'>
                        <Tab width='50%' color={"black"} >LogIn</Tab>
                        <Tab width='50%' color={"black"}>SignUp</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <LogIn />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>

        </Container>

    )
}

export default HomePage