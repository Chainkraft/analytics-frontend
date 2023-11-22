import { Container, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { fetcherAxios } from "../../helpers/fetcher-axios";
import StablecoinPieChart from "./StablecoinPieChart";
import StablecoinsShareChart from "./StablecoinsShareChart";

const R = require("ramda");

const StatsCharts = () => {
  const { data: globalData, error: globalDataError } = useSWR<any>(
    `stats/global`,
    fetcherAxios
  );

  const { data: stablesData, error: stablesDataError } = useSWR<any>(
    `stats/stablecoins`,
    fetcherAxios
  );

  const EMPTY_OBJECT: any = {};

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

  if (!globalData || !stablesData) {
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
        ></Box>
      </Box>

      {stablesData && globalData && (
        <Box
          id="stablecoin-share-pie-chart"
          sx={{
            width: "60%",
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
          <Typography variant="h6">Stablecoins global market share</Typography>
          <StablecoinPieChart
            globalStats={globalData}
            stablecoinStats={stablesData}
          />
        </Box>
      )}
      {stablesData && globalData && (
        <Box id="stablecoin-share-area-chart">
          <StablecoinsShareChart
            globalStats={globalData}
            stablecoinStats={stablesData}
          />
        </Box>
      )}
    </Container>
  );
};

export default StatsCharts;
