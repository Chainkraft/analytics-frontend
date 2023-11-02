import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Brush,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currencyFormat } from "../../../helpers/helpers";
import CustomizedAxisTick from "./CustomizedAxisTick";
import moment from "moment";

const PriceChart = (props: any) => {
  let theme = useTheme();

  interface ChartData {
    date: string;
    price: number;
    peg: number;
  }

  let showSymbol = (props.showSymbol as boolean) ?? false;

  let days = (props.days as number) ?? 180;

  let prices = props.priceHistory.prices as { date: string; price: number }[];

  const chartData: ChartData[] = prices
    .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
    .slice(days * -1)
    .filter((item) => item.date && item.price)
    .map(({ date, price }) => {
      return {
        date: date ? moment(date).format("DD/MM") : "",
        price: price || 0,
        peg: 1,
      };
    });

  chartData[chartData.length - 1] = {
    date: moment().format("DD/MM"),
    price: props.token.current_price,
    peg: 1,
  };

  return (
    <Box
      id="price-chart-with-header"
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
      <Typography variant="h6" sx={{ p: 2 }}>
        {showSymbol ? `${props.token.symbol} price` : "Price"}
      </Typography>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            height={55}
            tick={<CustomizedAxisTick stroke={theme.palette.text.primary} />}
            stroke="white"
            tickLine={false}
            strokeWidth={0.5}
          />
          <YAxis
            type="number"
            tickMargin={15}
            tickFormatter={(tick) => tick.toFixed(1)}
            stroke="white"
            strokeWidth={0.5}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2]}
            tickLine={false}
          />
          {/* domain={([dataMin, dataMax]) => [dataMin - 0.05 < 0 ? 0 : dataMin - 0.05, dataMax + 0.05]} /> */}

          <Tooltip
            contentStyle={{ backgroundColor: theme.palette.background.paper }}
            formatter={(value: any, name: any) => {
              return currencyFormat(value, 3);
            }}
          />

          <Line
            connectNulls
            type="monotone"
            dataKey="price"
            strokeWidth={3}
            dot={false}
            stroke={theme.palette.secondary.main}
          />

          <Line
            type="monotone"
            dataKey="peg"
            strokeDasharray="3 3"
            dot={false}
            activeDot={false}
            stroke={theme.palette.text.secondary}
          />

          {days > 30 && (
            <Brush
              alwaysShowText={false}
              dataKey="date"
              fill={theme.palette.background.paper}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PriceChart;
