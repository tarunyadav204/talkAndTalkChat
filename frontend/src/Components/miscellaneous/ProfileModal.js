import React from 'react';
import { Image, Box } from '@chakra-ui/react'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Text,
    IconButton
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';


const ProfileModal = ({ user, children }) => {
    const OverlayOne = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            // backdropInvert='80%'
            backdropBlur='4px'
        />
    );
    //console.log(user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = React.useState(<OverlayOne />);

    return (
        <>
            {children ? (
                <span onClick={() => {
                    setOverlay(<OverlayOne />);
                    onOpen();
                }}>
                    {children}
                </span>
            ) : (
                <IconButton
                    display={{ base: "flex" }}
                    background={"transparent"}
                    fontSize={"20px"}
                    icon={<ViewIcon />}
                    onClick={() => {
                        setOverlay(<OverlayOne />);
                        onOpen();
                    }}
                />

            )}

            {/* Modal */}
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent style={{ background: "transparent" }}>
                    <ModalHeader textAlign="center" style={{ fontSize: "25px", color: "peru" }}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="15px">
                        <Text color="black" style={{ fontWeight: "100", fontSize: "20px" }}> Email-ID : {user.email}</Text>
                        <Box margin="0 100px" border="2px solid black" borderRadius='100%'
                            boxSize='200px'>
                            <Image src={user.pic} alt={user.name} borderRadius='100%' objectFit={"cover"}
                                boxSize='200px'
                            />
                        </Box>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    );
};

export default ProfileModal;