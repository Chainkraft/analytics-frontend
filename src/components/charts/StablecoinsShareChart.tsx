import { Box, Typography, useTheme } from "@mui/material";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GlobalStats,
  StablecoinStats,
} from "../../interfaces/charts.interface";
import CustomizedAxisTick from "../stablecoin/charts/CustomizedAxisTick";

const StablecoinsShareChart = ({
  globalStats,
  stablecoinStats,
}: {
  globalStats: GlobalStats[];
  stablecoinStats: StablecoinStats[];
}) => {
  let theme = useTheme();

  // Extracting the last 7 days of data
  const last7DaysGlobalStats = globalStats.slice(-7);
  const last7DaysStablecoinStats = stablecoinStats.slice(-7);

  // Custom formatter for the X-axis
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}`;
  };

  // Formatting the data for the chart
  const formattedData = last7DaysGlobalStats.map((globalStat) => {
    const stablecoinStat = last7DaysStablecoinStats.find(
      (stat) => stat._id === globalStat._id
    );
    return {
      date: formatDate(globalStat._id),
      Total: globalStat.totalMarketCap,
      Stablecoins: stablecoinStat ? stablecoinStat.totalMarketCapUSD : 0,
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.paper",
        borderRadius: "12px",
        boxShadow: 1,
        p: 2,
        mt: 2,
        mb: 2,
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Stablecoins global market share (last 7 days)
      </Typography>
      <Box
        sx={{
          width: "100%",
          mt: 2,
          p: 1,
        }}
      >
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart data={formattedData}>
            <XAxis
              dataKey="date"
              height={55}
              tick={<CustomizedAxisTick stroke={theme.palette.text.primary} />}
            />
            <YAxis
              type="number"
              tickMargin={15}
              tick={{ fill: theme.palette.text.primary }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <Tooltip
              contentStyle={{ backgroundColor: theme.palette.background.paper }}
              formatter={(value, name) => [`${value}`, name]}
            />
            <Area
              type="monotone"
              dataKey="Stablecoins"
              stackId="1"
              stroke="#FFB83C"
              fill="#FFB83C"
            />
            <Area
              type="monotone"
              dataKey="Total"
              stackId="1"
              stroke="#FFB83C"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StablecoinsShareChart;
