import React, { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, FormHelperText, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
    const toast = useToast()
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!email || !password) {
            toast({
                title: 'Please Fill all the Fields.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            //const response = await axios.post("http://localhost:4000/api/user/login", { email, password });
            const response = await axios.post(`/api/user/login`, { email, password });
            const data = await response.data;
            // console.log(data, "..................");
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (err) {
            toast({
                title: 'An error occurred while logging in.',
                description: err.response.data.msg,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
        }
    };


    return (
        <VStack spacing='4px'>
            <FormControl id='fname' isRequired>

                <FormLabel>Email address</FormLabel>
                <Input type='email' placeholder='Enter Email Address' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />


                <FormLabel>Password</FormLabel>

                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        value={password}
                        name='password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button background='lightgreen' h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>


            </FormControl>

            <Button width="100%" colorScheme="blue" color="black" fontSize="20px" style={{ marginTop: 15 }}
                isLoading={loading}
                onClick={handleSubmit}>LogIn</Button>

        </VStack>
    )
}
export default LogIn