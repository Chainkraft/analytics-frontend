import { useTheme } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Brush
} from "recharts";
import { currencyFormat } from '../../../helpers/helpers';
import CustomizedAxisTick from './CustomizedAxisTick';

const MarketCapChart = (props: any) => {

    let theme = useTheme();

    interface ChartData {
        date: string;
        marketCap: number;
    }

    let marketCaps = props.marketCapHistory.market_caps as { date: string; market_cap: number }[];

    const chartData: ChartData[] = marketCaps
        .sort((a, b) => Date.parse(a.date) - (Date.parse(b.date)))
        .slice(-180)
        .filter(item => item.date && item.market_cap)
        .map(({ date, market_cap }) => {
            return {
                date: date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) : '',
                marketCap: market_cap || 0
            };
        });

    chartData[chartData.length - 1] = { date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }), marketCap: props.token.current_market_cap };

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
                        return [currencyFormat(value), "Market Cap"];
                    }}
                />

                <Area
                    connectNulls
                    type="monotone"
                    dataKey="marketCap"
                    stackId="1"
                    stroke={theme.palette.secondary.main}
                    fill={theme.palette.secondary.main}
                />
                <Brush alwaysShowText={false} dataKey="date"
                    fill={theme.palette.background.paper}
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}


export default MarketCapChart; 