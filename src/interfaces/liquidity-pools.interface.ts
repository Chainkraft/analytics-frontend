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
    tvl?: number;
}

export interface LiquidityPoolHistory {
    dex: string;
    network: string;
    name: string;
    symbol: string;
    assetTypeName: string;
    address: string;
    balances: { coins: ICoinFromPoolDataApi[]; date: Date }[];
    underlyingBalances: { coins: ICoinFromPoolDataApi[]; date: Date }[];
    isMetaPool: boolean;
    usdTotal: number;
    usdtotalExcludingBasePool: number;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface ICoinFromPoolDataApi {
    address: string;
    symbol: string;
    decimals: string;
    usdPrice: number | string;
    // added by us
    poolBalance: string;
}
