import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/toast';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import AuthProvider from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";

import LoginPage from "./components/auth/LoginPage.jsx";
import SignupPage from "./components/auth/SignupPage.jsx";
import MarketplacePage from "./components/marketplace/MarketplacePage.jsx";
import MessagesPage from "./components/messages/MessagesPage.jsx";

import './styles/global.css';

const { ToastContainer } = createStandaloneToast();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/marketplace",
        element: (
            <ProtectedRoute>
                <MarketplacePage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/messages",
        element: (
            <ProtectedRoute>
                <MessagesPage />
            </ProtectedRoute>
        ),
    },
    {
        // Catch-all redirect
        path: "*",
        element: <Navigate to="/marketplace" replace />,
    },
]);

ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <React.StrictMode>
            <ChakraProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
                <ToastContainer />
            </ChakraProvider>
        </React.StrictMode>,
    );
