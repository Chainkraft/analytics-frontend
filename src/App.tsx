import './App.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import StableCoinList from './components/stablecoin/StableCoinList';
import Alerts from './components/home/Subscription';
import {Route, Routes, useLocation} from 'react-router-dom';
import StableCoinDashboard from './components/stablecoin/StableCoinDashboard';
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LiquidityPoolsDashboard from './components/stablecoin/defi/liquidity-pools/LiquidityPoolDashboard';
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import RequestAccess from "./components/auth/RequestAccess";
import {AuthContextProvider} from "./components/auth/AuthContext";
import NotificationList from "./components/notification/NotificationList";

function App() {

    const showFooter = useLocation().pathname !== '/login'

    return (
        <AuthContextProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Header/>
                <Routes>
                    <Route
                        path="/"
                        element={<Home/>}
                    />
                    <Route
                        path="/login"
                        element={<Login/>}
                    />
                    <Route
                        path="/invite"
                        element={<RequestAccess/>}
                    />
                    <Route
                        path="/notifications"
                        element={<NotificationList/>}
                    />
                    <Route
                        path="/stablecoins"
                        element={<StableCoinList/>}
                    />
                    <Route
                        path="/alerts"
                        element={<Alerts/>}
                    />
                    <Route
                        path="/tokens/:tokenId"
                        element={<StableCoinDashboard/>}
                    />
                    <Route
                        path="/pools/:network/:address"
                        element={<LiquidityPoolsDashboard/>}
                    />
                </Routes>
                {showFooter && <Footer/>}
            </ThemeProvider>
        </AuthContextProvider>
    )
}

export default App;