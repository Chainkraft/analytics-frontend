import { Container, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";
import { shortCurrencyFormat } from "../../helpers/helpers";
import MarketCapChart from "./charts/MarketCapChart";
import useSWR from "swr";
import React, { useMemo } from "react";
import { fetcherAxios } from "../../helpers/fetcher-axios";
import LiquidityPoolsSummary from "./defi/LiquidityPoolsSummary";
import PriceChart from "./charts/PriceChart";
import ChainkraftScoreChart from "./charts/ChainkraftScoreChart";

const R = require("ramda");

const StableCoinCharts = () => {
  let { tokenId } = useParams() as {
    tokenId: string;
  };

  const { data: tokenData, error } = useSWR<any>(
    `stablecoins/${tokenId}`,
    fetcherAxios
  );

  const EMPTY_OBJECT: any = {};

  const extendedData: any = useMemo(
    () => R.propOr(EMPTY_OBJECT, "data", tokenData),
    [tokenData]
  );

  const token: any = useMemo(
    () => R.propOr(EMPTY_OBJECT, "token", extendedData),
    [extendedData]
  );
  const priceHistory: any = useMemo(
    () => R.propOr(EMPTY_OBJECT, "priceHistory", extendedData),
    [extendedData]
  );
  const marketCapHistory: any = useMemo(
    () => R.prop("marketCapHistory", extendedData),
    [extendedData]
  );

  const name: any = useMemo(() => R.propOr("", "name", token), [token]);
  const symbol: any = useMemo(() => R.propOr("", "symbol", token), [token]);

  function renderError() {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          p: 2,
        }}
      >
        An error has occurred.
      </Container>
    );
  }

  function renderLoading() {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={200} />
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return renderError();
  }
  if (!tokenData) {
    return renderLoading();
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography variant="h5">
            {name} ({symbol})
          </Typography>
        </Box>
      </Box>

      {/* <ContractSummary tokenId={tokenId}></ContractSummary> */}

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 1,
          mt: 2,
          p: 2,
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column-reverse",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 1,
            flex: 1,
          }}
        >
          <Typography variant="subtitle2">Overview</Typography>
          <Typography variant="body1">{token.description}</Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Backing strategy
          </Typography>
          <Typography variant="body1">Crypto-backed</Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Regulated
          </Typography>
          <Typography variant="body1">
            {token.regulated ? "Yes" : "No data"}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Audits
          </Typography>
          <Typography variant="body1">
            {token.audits ? "Yes" : "No data"}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Issuer
          </Typography>
          <Typography variant="body1">
            {token.issuer ? token.issuer : "No data"}
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              minWidth: "40%",
            },
            flex: 1,
            position: "relative",
          })}
        >
          <ChainkraftScoreChart token={token} priceHistory={priceHistory} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 1,
            fontWeight: "bold",
            p: 2,
            flexGrow: 1,
          }}
        >
          <Typography variant="h6">Price</Typography>
          <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
            ${token.current_price}
          </Typography>
        </Box>

        {token.current_market_cap > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "background.paper",
              borderRadius: "12px",
              boxShadow: 1,
              fontWeight: "bold",
              p: 2,
              flexGrow: 1,
            }}
          >
            <Typography variant="h6">Market cap</Typography>
            <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
              {shortCurrencyFormat(token.current_market_cap)}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 1,
            fontWeight: "bold",
            p: 2,
            flexGrow: 1,
          }}
        >
          <Typography variant="h6">24h volume</Typography>
          <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
            {shortCurrencyFormat(token.volume_24h)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 1,
            fontWeight: "bold",
            p: 2,
            flexGrow: 1,
          }}
        >
          <Typography variant="h6">Chains</Typography>
          <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
            {token.chains.length}
          </Typography>
        </Box>
      </Box>

      {priceHistory && (
        <PriceChart
          token={token}
          priceHistory={priceHistory}
          days={14}
          showSymbol={true}
        />
      )}

      {marketCapHistory && (
        <Box
          id="mcap-chart-with-header"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 1,
            mt: 2,
            p: 2,
          }}
        >
          <Typography variant="h6">{token.symbol} market cap</Typography>
          <MarketCapChart
            token={token}
            marketCapHistory={marketCapHistory}
            days={30}
            showSymbol={true}
          />
        </Box>
      )}

      {/* <Box
        sx={{
          mt: 2,
        }}
      >
        <LiquidityPoolsSummary token={tokenId} />
      </Box> */}

      {/* <Box
                sx={{
                    display: 'flex',
                    gap: '20px',
                    mt: 2,
                }}>
                <Box
                    sx={{ flex: 1 }}>
                    <TopLiquidityPoolsTable token={tokenId} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: '12px',
                        boxShadow: 1,
                        fontWeight: 'bold',
                        p: 2,
                        flex: 1
                    }}
                >
                    <Typography variant="h6">What is a liquidity pool?</Typography>
                    <Typography variant="body1" sx={{ mt: 1, p: 3 }}>
                        In decentralized finance (DeFi), a liquidity pool is a collection of assets that are pooled together and made available to be borrowed or lent. Liquidity pools are typically used to provide liquidity to decentralized exchanges (DEXs) and other DeFi platforms, allowing users to buy and sell assets without the need for a centralized exchange.
                        <br /><br />
                        Liquidity pools play a key role in DeFi, as they provide the necessary liquidity for decentralized exchanges and other DeFi platforms to function. They also offer an opportunity for users to earn passive income by contributing assets to the pool and sharing in the fees and rewards generated by trades.
                    </Typography>
                </Box>
            </Box> */}
    </Container>
  );
};

export default StableCoinCharts;
