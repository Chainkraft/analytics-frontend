export interface StablecoinLiquidityPoolSummary {
    tokenSymbol: string;
    tokenSlug: string;
    pools: ShortLiquidityPool[];
}

export interface ShortLiquidityPool {
    name: string;
    symbol: string;
    address: string;
    dex: string;
    network?: string;
    tvl?: number;
    tokens?: string[];
}

export interface LiquidityPoolHistory {
    dex: string;
    network: string;
    name: string;
    symbol: string;
    assetTypeName: string;
    address: string;
    pricingType: LiquidityPoolPricingType;
    balances: { coins: ICoinFromPoolDataApi[]; date: Date; block: number }[];
    underlyingBalances: { coins: ICoinFromPoolDataApi[]; date: Date; block: number }[];
    poolDayData: IPoolDayData[];
    isMetaPool: boolean;
    tvlUSD: number;
    volumeUSD: number;
    usdTotal: number;
    usdtotalExcludingBasePool: number;
    updatedAt?: Date;
    createdAt?: Date;
}

// This is from uniswap-v3 subgraph
export interface IPoolDayData {
    date: Date;
    tvlUSD: string;
    volumeToken0: string;
    volumeToken1: string;
    volumeUSD: string;
    token0Price: string;
    token1Price: string;
}

export enum LiquidityPoolPricingType {
    USD = 'USD',
    RATIO = 'RATIO',
}

export interface ICoinFromPoolDataApi {
    address: string;
    symbol: string;
    decimals: string;
    usdPrice: number | string;
    price: string;
    // added by us
    poolBalance: string;
    weight: number;
}

export enum SupportedDexes {
    CURVE = 'curve',
    UNISWAP = 'uniswap',
}

export enum LiquidityPoolSummaryStatus {
    OK = 'OK',
    WARNING = 'WARNING',
    ALARM = 'ALARM'
}

export interface LiquidityPoolSummary {
    liquidityDepth: LiquidityPoolSummaryStatus,
    liquidityComposition: LiquidityPoolSummaryStatus,
    volume: LiquidityPoolSummaryStatus,
}