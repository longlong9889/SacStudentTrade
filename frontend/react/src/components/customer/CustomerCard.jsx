import { useEffect, useState, useRef } from 'react';
import {
    Avatar, Box, Button, Center, Flex, Heading, Stack, Tag, Text,
    useColorModeValue, useDisclosure, AlertDialog, AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay
} from '@chakra-ui/react';
import { customerProfilePictureUrl, deleteCustomer } from "../../services/client.js";
import { errorNotification, successNotification } from "../../services/notification.js";
import UpdateCustomerDrawer from "./UpdateCustomerDrawer.jsx";

export default function CardWithImage({id, name, email, age, gender, fetchCustomers}) {
    const randomUserGender = gender === "MALE" ? "men" : "women";

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const [imgSrc, setImgSrc] = useState(null)

    // Fetch the JWT-protected profile picture
    useEffect(() => {
        const token = localStorage.getItem("access_token")
        fetch(customerProfilePictureUrl(id), {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Image fetch failed")
                return res.blob()
            })
            .then(blob => setImgSrc(URL.createObjectURL(blob)))
            .catch(err => console.log("Profile image error:", err))
    }, [id])

    return (
        <Center py={6}>
            <Box
                maxW={'300px'}
                minW={'300px'}
                w={'full'}
                m={2}
                pt={12}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'lg'}
                rounded={'md'}
                overflow={'hidden'}>
                <Flex justify={'center'} mt={-12}>
                    <Avatar
                        size={'xl'}
                        src={imgSrc}  // use the blob object URL
                        alt={'Author'}
                        css={{ border: '2px solid white' }}
                    />
                </Flex>

                <Box p={6}>
                    <Stack spacing={2} align={'center'} mb={5}>
                        <Tag borderRadius={"full"}>{id}</Tag>
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                            {name}
                        </Heading>
                        <Text color={'gray.500'}>{email}</Text>
                        <Text color={'gray.500'}>Age {age} | {gender}</Text>
                    </Stack>
                </Box>

                <Stack direction={'row'} justify={'center'} spacing={6} p={4}>
                    <UpdateCustomerDrawer
                        initialValues={{ name, email, age }}
                        customerId={id}
                        fetchCustomers={fetchCustomers}
                    />
                    <Button
                        bg={'red.400'}
                        color={'white'}
                        rounded={'full'}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        _focus={{ bg: 'green.500' }}
                        onClick={onOpen}
                    >
                        Delete
                    </Button>

                    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>Delete Customer</AlertDialogHeader>
                                <AlertDialogBody>
                                    Are you sure you want to delete {name}? You can't undo this action afterwards.
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
                                    <Button colorScheme='red' onClick={() => {
                                        deleteCustomer(id)
                                            .then(() => {
                                                successNotification('Customer deleted', `${name} was successfully deleted`)
                                                fetchCustomers()
                                            })
                                            .catch(err => errorNotification(err.code, err.response?.data?.message || "Delete failed"))
                                            .finally(() => onClose())
                                    }} ml={3}>Delete</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Stack>
            </Box>
        </Center>
    )
}
