import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { AuthContextProvider } from "./components/auth/AuthContext";
import Login from "./components/auth/Login";
import RequestAccess from "./components/auth/RequestAccess";
import Alerts from "./components/home/Subscription";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import NotificationList from "./components/notification/NotificationList";
import LiquidityPoolsDashboard from "./components/stablecoin/defi/liquidity-pools/LiquidityPoolDashboard";
import PoolsTable from "./components/stablecoin/defi/PoolsTable";

import StableCoinDashboard from "./components/stablecoin/StableCoinDashboard";
import StableCoinList from "./components/stablecoin/StableCoinList";
import theme from "./theme";
import StableCoinCharts from "./components/stablecoin/StableCoinCharts";
import StatsCharts from "./components/charts/StatsCharts";

function App() {
  const showFooter = useLocation().pathname !== "/login";

  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Routes>
          <Route path="/" element={<StableCoinList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/invite" element={<RequestAccess />} />
          <Route path="/notifications" element={<NotificationList />} />
          <Route path="/stablecoins" element={<StableCoinList />} />
          <Route path="/pools" element={<PoolsTable />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/tokens/:tokenId" element={<StableCoinDashboard />} />
          <Route path="/charts/token/:tokenId" element={<StableCoinCharts />} />
          <Route path="/charts/stats" element={<StatsCharts />} />
          <Route
            path="/pools/:network/:address"
            element={<LiquidityPoolsDashboard />}
          />
        </Routes>
        {showFooter && <Footer />}
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;
