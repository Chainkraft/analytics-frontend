import { useTheme } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { currencyFormat } from '../../../../helpers/helpers';
import { ICoinFromPoolDataApi } from '../../../../interfaces/liquidity-pools.interface';
import CustomizedAxisTick from '../../charts/CustomizedAxisTick';

const LiquidityCompositionChart = (props: any) => {

    var balances = props.lp.balances as { coins: ICoinFromPoolDataApi[]; date: Date }[];
    var underlyingBalances = props.lp.underlyingBalances as { coins: ICoinFromPoolDataApi[]; date: Date }[];

    let chartBalances = (underlyingBalances.length > 0 && underlyingBalances[0].coins.length > 0)
        ? underlyingBalances : balances;

    interface ChartData {
        date: string;
        [symbol: string]: number | string;
    }

    const chartData = chartBalances.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).map(({ date, coins }) => {
        const dataPoint: ChartData = { date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) };
        coins.forEach(({ symbol, decimals, poolBalance }) => {
            const decimalMultiplier = 10 ** parseInt(decimals);
            dataPoint[symbol] = Math.floor(parseFloat(poolBalance) / decimalMultiplier);
        });
        return dataPoint;
    });

    let coins: string[] = Array.from(new Set(chartBalances.map((balance) => balance.coins.map((coin: any) => coin.symbol)).reduce((acc, val) => acc.concat(val), [])));

    let theme = useTheme();
    let availableColors = [
        "#ffa600",
        "#a05195",
        "#ff7c43",
        "#665191",
        "#003f5c",
        "#f95d6a",
        "#d45087",
        "#2f4b7c",
    ]
    let coinToColorMap = new Map(coins.map((coin, index) => [coin, availableColors[index]]));

    return (
        <ResponsiveContainer width="100%" height={500}>
            <AreaChart
                data={chartData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date"
                    height={55}
                    tick={<CustomizedAxisTick stroke={theme.palette.text.primary} />} />
                <YAxis
                    type="number"
                    tickMargin={15}
                    tick={{ fill: theme.palette.text.primary }}
                    tickFormatter={(value) =>
                        new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            compactDisplay: "short",
                        }).format(value)}
                />
                <Tooltip contentStyle={{ backgroundColor: theme.palette.primary.main }}
                    formatter={(value: any) => {
                        return currencyFormat(value);
                    }}
                />

                {coins.map((coin) => {
                    return (
                        <Area
                            type="monotone"
                            dataKey={coin}
                            stackId="1"
                            stroke={coinToColorMap.get(coin)}
                            fill={coinToColorMap.get(coin)}
                        />
                    );
                })
                }

            </AreaChart>
        </ResponsiveContainer>
    );
}


export default LiquidityCompositionChart; 