import { useTheme } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { currencyFormat } from '../../../../helpers/helpers';
import { LiquidityPoolHistory } from '../../../../interfaces/liquidity-pools.interface';
import CustomizedAxisTick from '../../charts/CustomizedAxisTick';

const LiquidityVolumeChart = (props: any) => {

    let theme = useTheme();

    interface ChartData {
        date: string;
        volumeUSD: number;
    }

    let lp = props.lp as LiquidityPoolHistory;

    let chartData: ChartData[] = lp.poolDayData.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).map((poolDayData) => {
        return {
            date: new Date(poolDayData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
            volumeUSD: Number(poolDayData.volumeUSD)
        }
    });

    return (
        <ResponsiveContainer width="100%" height={500}>
            <AreaChart
                data={chartData}
            >
                <XAxis
                    dataKey="date"
                    height={55}
                    stroke="white"
                    tickLine={false}
                    strokeWidth={0.5}
                    tick={<CustomizedAxisTick stroke={theme.palette.text.primary} />}
                />
                <YAxis
                    type="number"
                    tickMargin={15}
                    stroke="white"
                    tickLine={false}
                    strokeWidth={0.5}
                    tick={{ fill: theme.palette.text.primary }}
                    tickFormatter={(value) =>
                        new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            compactDisplay: "short",
                        }).format(value)}
                />
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}
                    formatter={(value: any, name: any) => {
                        return [currencyFormat(value), "Volume"];
                    }}
                />

                <Area
                    connectNulls
                    type="monotone"
                    dataKey="volumeUSD"
                    stackId="1"
                    stroke={theme.palette.secondary.main}
                    fill={theme.palette.secondary.main}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}


export default LiquidityVolumeChart; 