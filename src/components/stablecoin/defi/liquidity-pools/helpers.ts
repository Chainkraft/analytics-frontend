import moment from "moment";
import { ICoinFromPoolDataApi, LiquidityPoolHistory } from "../../../../interfaces/liquidity-pools.interface";

export interface ChartData {
    date: string;
    [symbol: string]: number | string;
}

export function processUniswapData(
    { coins, date }: { coins: ICoinFromPoolDataApi[]; date: Date },
    lp: LiquidityPoolHistory,
): ChartData {
    const [coin0, coin1] = coins;
    const token0UsdPrice = coin0.usdPrice;
    const token1UsdPrice = coin1.usdPrice;

    const dataPoint: ChartData = { date: moment(date).toISOString() };

    dataPoint[coin0.symbol] = Number(token0UsdPrice) * Number(coin0.poolBalance);
    dataPoint[coin1.symbol] = Number(token1UsdPrice) * Number(coin1.poolBalance);

    return dataPoint;
}