import { Token } from "./tokens.inteface";
import { Contract } from "./contracts.interface";
import { LiquidityPoolHistory } from "./liquidity-pools.interface";

export interface Notification {
  _id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  data?: NotificationStablecoinDepegDataSchema | NotificationContractChangeDataSchema | any;

  token?: Token;
  contract?: Contract;
  liquidityPool?: LiquidityPoolHistory;

  updatedAt: Date;
  createdAt: Date;
}

export enum NotificationType {
  CONTRACT_PROXY_ADMIN_CHANGE = 'CONTRACT_PROXY_ADMIN_CHANGE',
  CONTRACT_PROXY_IMPL_CHANGE = 'CONTRACT_PROXY_IMPL_CHANGE',
  STABLECOIN_DEPEG = 'STABLECOIN_DEPEG',
  USER_ACCOUNT = 'USER_ACCOUNT',
  LP_COMPOSITION_CHANGE = 'LP_COMPOSITION_CHANGE',
}

export enum NotificationSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
}

export interface NotificationStablecoinDepegDataSchema {
  price: number;
  avgPrice: number;
  prices: number[];
  chains: string[];
}

export interface NotificationContractChangeDataSchema {
  oldAddress: string;
  newAddress: string;
}

export interface NotificationLiquidityPoolCompositionChange {
  token: string;
  weight: number;
  weightChange: number;
  balance: number;
  date: Date;
}

export interface NotificationPage {
  data: Notification[];
  count: number;
  currentPage: number;
}
