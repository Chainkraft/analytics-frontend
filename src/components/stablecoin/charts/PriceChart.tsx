import { useTheme } from '@mui/material';
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Brush,
    LineChart,
    Line
} from "recharts";
import { currencyFormat } from '../../../helpers/helpers';

const PriceChart = (props: any) => {

    let theme = useTheme();

    interface ChartData {
        date: string;
        price: number;
        peg: number;
    }

    let prices = props.priceHistory.prices as { date: string; price: number }[];

    const chartData: ChartData[] = prices
        .sort((a, b) => Date.parse(a.date) - (Date.parse(b.date)))
        .slice(-180)
        .filter(item => item.date && item.price)
        .map(({ date, price }) => {
            return {
                date: date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) : '',
                price: price || 0,
                peg: 1
            };
        });

    console.log("price chart data", chartData);
    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart
                data={chartData}
            >
                <XAxis
                    dataKey="date"
                    height={45}
                    tick={{ fill: theme.palette.text.primary }}
                    stroke="white"
                    tickLine={false}
                    tickMargin={10} />
                <YAxis
                    type="number"
                    tickMargin={15}
                    tickFormatter={tick => tick.toPrecision(3)}
                    stroke="white"
                    tickLine={false} />
                {/* domain={([dataMin, dataMax]) => [dataMin - 0.05 < 0 ? 0 : dataMin - 0.05, dataMax + 0.05]} /> */}

                <Tooltip contentStyle={{ backgroundColor: theme.palette.primary.main }}
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
                    strokeDasharray="10"
                    dot={false}
                    activeDot={false}
                    stroke={theme.palette.text.secondary}
                />
                <Brush alwaysShowText={false} dataKey="date"
                    fill={theme.palette.primary.main}
                />

            </LineChart>
        </ResponsiveContainer>
    );
}


export default PriceChart; 