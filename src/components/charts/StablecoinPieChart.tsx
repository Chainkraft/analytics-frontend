import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  GlobalStats,
  StablecoinStats,
} from "../../interfaces/charts.interface";

const StablecoinPieChart = ({
  globalStats,
  stablecoinStats,
}: {
  globalStats: GlobalStats[];
  stablecoinStats: StablecoinStats[];
}) => {
  const theme = useTheme();

  // Assuming that the arrays are sorted and the last element is the latest
  const latestGlobalStat = globalStats[globalStats.length - 1];
  const latestStablecoinStat = stablecoinStats[stablecoinStats.length - 1];

  const data = [
    {
      name: "Stablecoins",
      value: latestStablecoinStat?.totalMarketCapUSD || 0,
    },
    {
      name: "Other crypto",
      value:
        latestGlobalStat?.totalMarketCap -
        (latestStablecoinStat?.totalMarketCapUSD || 0),
    },
  ];

  const COLORS = [alpha("#FFB83C", 0.7), alpha("#3E517A", 0.7)]; // Bright orange and dark slate blue

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={data}
          outerRadius={220}
          dataKey="value"
          labelLine={false}
          isAnimationActive={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            name,
            percent,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius + 50; // Positioned outside of the pie
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                fill="white"
                textAnchor="middle" // This centers the group of tspans
              >
                {/* Name label aligned to the middle */}
                <tspan x={x} y={y - 10}>
                  {name}
                </tspan>
                {/* Percentage label aligned to the middle, positioned below the name */}
                <tspan x={x} y={y + 10}>{`${(percent * 100).toFixed(
                  2
                )}%`}</tspan>
              </text>
            );
          }}
        >
          <Cell key={`cell-stables`} fill={COLORS[0]} stroke={COLORS[0]} />
          <Cell key={`cell-other`} fill={COLORS[1]} stroke={COLORS[1]} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StablecoinPieChart;
