import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Heading,
    Input,
    SimpleGrid,
    Stack,
    Textarea,
    useToast
} from "@chakra-ui/react";
import ItemCard from "./ItemCard.jsx";
import { createItem, deleteItem, getAllItems } from "../../services/itemService.js";

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ title: "", description: "", price: "", category: "" });
    const toast = useToast();

    const fetchItems = async () => {
        const data = await getAllItems();
        setItems(data);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleCreate = async () => {
        const sellerId = localStorage.getItem("customerId");
        await createItem(sellerId, newItem);
        toast({ title: "Item posted!", status: "success", duration: 2000 });
        setNewItem({ title: "", description: "", price: "", category: "" });
        fetchItems();
    };

    const handleDelete = async (id) => {
        await deleteItem(id);
        toast({ title: "Item deleted", status: "info", duration: 2000 });
        fetchItems();
    };

    return (
        <Box p={8}>
            <Center>
                <Heading mb={6}>Sac State Marketplace</Heading>
            </Center>

            <Stack direction="row" spacing={4} mb={8}>
                <Input
                    placeholder="Item title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
                <Input
                    placeholder="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
                <Input
                    placeholder="Price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <Textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <Button colorScheme="green" onClick={handleCreate}>
                    Post Item
                </Button>
            </Stack>

            <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
                {items.map((item) => (
                    <ItemCard key={item.id} item={item} onDelete={handleDelete} />
                ))}
            </SimpleGrid>
        </Box>
    );
}
