import { useTheme } from '@mui/material';
import moment from 'moment';
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
import { ICoinFromPoolDataApi, LiquidityPoolHistory, LiquidityPoolPricingType } from '../../../../interfaces/liquidity-pools.interface';
import CustomizedAxisTick from '../../charts/CustomizedAxisTick';

interface ChartData {
    date: string;
    [symbol: string]: number | string;
}

export function calculateUniswapLiquidityChartData(
    lp: LiquidityPoolHistory,
    chartBalances: { coins: ICoinFromPoolDataApi[]; date: Date }[]
): ChartData[] {

    return chartBalances.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).filter((balance) => {
        return moment.utc(balance.date).isSame(moment.utc(balance.date).startOf("day"));
    }).map(({ date, coins }) => {

        const [coin0, coin1] = coins;
        const token0Weight = Number(coin0.poolBalance) / lp.tvlUSD;
        const token1Weight = Number(coin1.poolBalance) * Number(coin0.price) / lp.tvlUSD;
        const token0UsdPrice = lp.tvlUSD * token0Weight / Number(coin0.poolBalance);
        const token1UsdPrice = lp.tvlUSD * token1Weight / Number(coin1.poolBalance);

        const dataPoint: ChartData = { date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) };

        dataPoint[coin0.symbol] = token0UsdPrice * Number(coin0.poolBalance);
        dataPoint[coin1.symbol] = token1UsdPrice * Number(coin1.poolBalance);

        return dataPoint;
    })
}

const LiquidityCompositionChart = ({ lp }: { lp: LiquidityPoolHistory }) => {

    var balances = lp.balances as { coins: ICoinFromPoolDataApi[]; date: Date }[];
    var underlyingBalances = lp.underlyingBalances as { coins: ICoinFromPoolDataApi[]; date: Date }[];

    let chartBalances = (underlyingBalances.length > 0 && underlyingBalances[0].coins.length > 0)
        ? underlyingBalances : balances;

    const chartData = lp.pricingType === LiquidityPoolPricingType.USD ? chartBalances.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).map(({ date, coins }) => {
        const dataPoint: ChartData = { date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) };
        coins.forEach(({ symbol, decimals, poolBalance }) => {
            const decimalMultiplier = 10 ** parseInt(decimals);
            dataPoint[symbol] = Math.floor(parseFloat(poolBalance) / decimalMultiplier);
        });
        return dataPoint;
    }) : calculateUniswapLiquidityChartData(lp, chartBalances);

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
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}
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