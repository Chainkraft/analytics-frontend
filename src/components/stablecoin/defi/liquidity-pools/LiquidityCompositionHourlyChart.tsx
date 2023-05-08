import { Box, useTheme } from '@mui/material';
import moment from 'moment';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { currencyFormat } from '../../../../helpers/helpers';
import { ICoinFromPoolDataApi, LiquidityPoolHistory, LiquidityPoolPricingType } from '../../../../interfaces/liquidity-pools.interface';

interface ChartData {
    date: string;
    [symbol: string]: number | string;
}


export function getHourlyData(chartBalances: { coins: ICoinFromPoolDataApi[]; date: Date }[]) {
    const sortedValues = chartBalances
        .filter(value => moment().diff(moment(value.date), 'hours') < 48)
        .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

    // Create a new array to hold the first value for each hour
    const hourlyData = [];

    // Iterate over the sorted and filtered chartValues array and get the first value for each hour
    for (let i = 0; i < sortedValues.length; i++) {
        const value = sortedValues[i];
        const prevValue = sortedValues[i - 1];

        // Check if this is the first value for the hour
        const isFirstHourValue = !prevValue || !moment(value.date).isSame(moment(prevValue.date), 'hour');

        if (isFirstHourValue) {
            hourlyData.push(value);
        }
    }

    return hourlyData;
}

export function processUniswapData(
    { coins, date }: { coins: ICoinFromPoolDataApi[]; date: Date },
    dateFormat: string,
    lp: LiquidityPoolHistory,
): ChartData {
    const [coin0, coin1] = coins;
    const token0Weight = Number(coin0.poolBalance) / lp.tvlUSD;
    const token1Weight = Number(coin1.poolBalance) * Number(coin0.price) / lp.tvlUSD;
    const token0UsdPrice = lp.tvlUSD * token0Weight / Number(coin0.poolBalance);
    const token1UsdPrice = lp.tvlUSD * token1Weight / Number(coin1.poolBalance);

    const dataPoint: ChartData = { date: moment(date).format(dateFormat) };

    dataPoint[coin0.symbol] = token0UsdPrice * Number(coin0.poolBalance);
    dataPoint[coin1.symbol] = token1UsdPrice * Number(coin1.poolBalance);

    return dataPoint;
}

function processData(
    { coins, date }: { coins: ICoinFromPoolDataApi[]; date: Date },
    dateFormat: string
): ChartData {
    const dataPoint: ChartData = {
        date: moment(date).format(dateFormat)
    };
    coins.forEach(({ symbol, decimals, poolBalance, usdPrice }) => {
        const decimalMultiplier = 10 ** parseInt(decimals);
        dataPoint[symbol] = Math.floor(parseFloat(poolBalance) / decimalMultiplier) * Number(usdPrice);
    });
    return dataPoint;
}

const LiquidityCompositionHourlyChart = ({ lp }: { lp: LiquidityPoolHistory }) => {

    var balances = lp.balances as { coins: ICoinFromPoolDataApi[]; date: Date }[];
    var underlyingBalances = lp.underlyingBalances as { coins: ICoinFromPoolDataApi[]; date: Date }[];

    let chartBalances = (underlyingBalances.length > 0 && underlyingBalances[0].coins.length > 0)
        ? underlyingBalances : balances;

    const hourlyData = getHourlyData(chartBalances).map(data =>
        lp.pricingType === LiquidityPoolPricingType.USD
            ? processData(data, "DD/MM HH:mm")
            : processUniswapData(data, "DD/MM HH:mm", lp));

    let chartData = hourlyData;

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

    if (chartData.length < 4) {
        return <Box />
    }

    return (
        <Box
            sx={() => ({
                width: '1',
                mt: 2,
                p: 1
            })}>
            <ResponsiveContainer width="100%" height={500}>
                <AreaChart
                    data={chartData} >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date"
                        height={55}
                        tickFormatter={(value) => {
                            return moment(value).format('HH:00')
                        }}
                        tick={{ fill: theme.palette.text.primary }}
                        tickMargin={16}
                        angle={-35}
                    />
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
                        labelFormatter={(value: any) => {
                            return moment(value).format('DD/MM HH:00');
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
                    })}
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
}


export default LiquidityCompositionHourlyChart; 