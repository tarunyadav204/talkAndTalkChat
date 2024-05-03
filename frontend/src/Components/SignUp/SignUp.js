import React, { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, FormHelperText, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './SignUp.css'
const SignUp = () => {
    const toast = useToast()

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const postDetails = async (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an Image!.',
                status: 'warning',
                duration: 5000,
                position: "bottom",
                isClosable: true,
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const formData = new FormData();
            formData.append("file", pics);
            formData.append("upload_preset", "chat-app");
            formData.append("cloud_name", "tarun1508");

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/tarun1508/image/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                //console.log(data);
                setPic(data.url.toString());
                setLoading(false);
            }
            catch (err) {
                console.log("Error : ", err);
                setLoading(false);
            }
        }
        else {
            toast({
                title: 'Please Select an Image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please Fill all the Feilds.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Password Do not Match!.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
            return;
        }

        try {

            // const response = await axios.post("http://localhost:4000/api/user/", { name, email, password, pic });
            const response = await axios.post(`api/user/`, { name, email, password, pic });
            const data = await response.data;
            console.log(data);
            toast({
                title: 'Registration Successful',
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
                title: 'An error occurred while submitting the form.',
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
        <div >
            <VStack spacing='4px'>
                <FormControl id='fname' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />

                    <FormLabel>Email address</FormLabel>
                    <Input type='email' placeholder='Enter Email Address' value={email} onChange={(e) => setEmail(e.target.value)} />


                    <FormLabel>Password</FormLabel>

                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button background='lightgreen' h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>

                    <FormLabel>Confirm Password</FormLabel>

                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            placeholder='Enter password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button background='lightgreen' h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>


                    <FormLabel>Profile Picture</FormLabel>
                    <Input type='file' placeholder='Upload Profile Pic'
                        p={1.5} accept='image/*'
                        // onChange={(e) => setPic(e.target.files[0])}
                        onChange={(e) => postDetails(e.target.files[0])} />
                </FormControl>

                <Button id='btns' width="100%" colorScheme="blue" color="black" fontSize="20px" style={{ marginTop: 15 }}
                    onClick={handleSubmit}
                    isLoading={loading}
                >SignUp</Button>
            </VStack>
        </div>
    )
}

export default SignUp