import './App.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import StableCoinList from './components/stablecoin/StableCoinList';
import Alerts from './components/Alerts';
import {Route, Routes} from 'react-router-dom';
import StableCoinDashboard from './components/stablecoin/StableCoinDashboard';
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Header></Header>
            <Routes>
                <Route
                    path="/"
                    element={<StableCoinList/>}
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
            </Routes>
            <Footer></Footer>
        </ThemeProvider>
    )
}

export default App;