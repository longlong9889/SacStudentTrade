import { getAuthToken } from "./client.js"; // helper to get JWT

const BASE_URL = "http://localhost:8080/api/v1/items";

export async function getAllItems() {
    const response = await fetch(BASE_URL, {
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    return response.json();
}

export async function getItemsBySeller(sellerId) {
    const response = await fetch(`${BASE_URL}/seller/${sellerId}`, {
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    return response.json();
}

export async function createItem(sellerId, itemData) {
    const response = await fetch(`${BASE_URL}/seller/${sellerId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(itemData)
    });
    return response.json();
}

export async function deleteItem(itemId) {
    return fetch(`${BASE_URL}/${itemId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
}
