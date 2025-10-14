import { Box, Image, Text, Stack, Heading, Button, useColorModeValue } from "@chakra-ui/react";

export default function ItemCard({ item, onDelete }) {
    return (
        <Box
            bg={useColorModeValue("white", "gray.800")}
            boxShadow="md"
            rounded="lg"
            overflow="hidden"
            maxW="250px"
            m={3}
        >
            <Image
                src={
                    item.imageId
                        ? `http://localhost:8080/api/v1/items/images/${item.imageId}`
                        : "https://via.placeholder.com/250x150?text=No+Image"
                }
                alt={item.title}
                h="150px"
                w="full"
                objectFit="cover"
            />
            <Stack p={4}>
                <Heading fontSize="lg">{item.title}</Heading>
                <Text fontWeight="bold">${item.price}</Text>
                <Text color="gray.600">{item.category}</Text>
                <Text noOfLines={2}>{item.description}</Text>
                <Button colorScheme="red" size="sm" onClick={() => onDelete(item.id)}>
                    Delete
                </Button>
            </Stack>
        </Box>
    );
}
