import { Container, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { fetcherAxios } from "../../../../helpers/fetcher-axios";
import {
  currencyFormat,
  dexLogos,
  dexLpNames,
  shortCurrencyFormat,
} from "../../../../helpers/helpers";
import { LiquidityPoolHistory } from "../../../../interfaces/liquidity-pools.interface";
import LiquidityCompositionChart from "./LiquidityCompositionChart";
import LiquidityCompositionHourlyChart from "./LiquidityCompositionHourlyChart";
import LiquidityCompositionTable from "./LiquidityCompositionTable";
import LiquidityPoolOverview from "./LiquidityPoolOverview";
import LiquidityVolumeBarChart from "./LiquidityPoolVolumeBarChart";

const LiquidityPoolsDashboard = () => {
  let { network, address } = useParams();

  const [search, setSearch] = useSearchParams();
  const { data, error } = useSWR<LiquidityPoolHistory>(
    `pools/${network}/address/${address}`,
    fetcherAxios
  );

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
            alignItems: "top",
            gap: "10px",
          }}
        >
          <Skeleton variant="circular" width={100} height={100} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            <Skeleton variant="text" width={200} />
            <Skeleton variant="text" width={200} />
          </Box>
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

  if (!data) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  let poolName = data.name
    ? data.name
    : `${dexLpNames[data.dex]} ${data.balances[0].coins
        .map((coin) => coin.symbol)
        .join("/")}`;

  // sort poolDayData by date descending
  let volume24h =
    data?.poolDayData?.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })[0]?.volumeUSD ?? null;

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
          flexDirection: "row",
          maxHeight: "100px",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            alt="Coin symbol"
            src={dexLogos[data.dex]}
            sx={{
              maxHeight: "100px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography variant="h5">{poolName}</Typography>
            <Typography variant="h6">
              TVL: {currencyFormat(data.usdTotal, 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <LiquidityPoolOverview lp={data} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          mt: 2,
        }}
      >
        {data?.tvlUSD > 0 && (
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
            <Typography variant="h6">Total Value Locked</Typography>
            <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
              {shortCurrencyFormat(data.tvlUSD)}
            </Typography>
          </Box>
        )}
        {volume24h && (
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
            <Typography variant="h6">Volume 24h</Typography>
            <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
              {shortCurrencyFormat(Number(volume24h))}
            </Typography>
          </Box>
        )}

        {data?.volumeUSD > 0 && (
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
            <Typography variant="h6">Overall Volume</Typography>
            <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
              {shortCurrencyFormat(data.volumeUSD)}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        id="chart-with-table-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 1,
          p: 2,
          mt: 2,
        }}
      >
        <Box
          id="chart-with-header-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ p: 2 }}>
            Liquidity composition
          </Typography>

          {search?.get("chart") === "hour" ? (
            <LiquidityCompositionHourlyChart lp={data} />
          ) : (
            <LiquidityCompositionChart lp={data} />
          )}
        </Box>
        <Box
          sx={{
            width: "1",
            p: 2,
          }}
        >
          <LiquidityCompositionTable lp={data} />
        </Box>
      </Box>

      {data?.poolDayData?.length >= 7 && <LiquidityVolumeBarChart lp={data} />}
    </Container>
  );
};

export default LiquidityPoolsDashboard;
