export interface ContractSummary {
    slug: string;
    network: ContractNetwork;
    proxyPattern: {
        status: ContractSummaryStatus;
        type: ContractProxyType;
        implSlot: string;
        adminSlot: string;
        address: string;
    };
    sourceCode: {
        status: ContractSummaryStatus;
        size: number;
        createdByBlock: number;
        createdByAddress: string;
        compilerVersion?: string;
    };
    proofOfTime: {
        status: ContractSummaryStatus;
        createdByBlock: number;
        createdByBlockAt: Date;
        updatedByBlock: number;
        updatedByBlockAt: Date;
    };
}

export enum ContractSummaryStatus {
    OK = 'OK',
    WARNING = 'WARNING',
    ALARM = 'ALARM'
}

export enum ContractNetwork {
    ETH_MAINNET = 'eth-mainnet',
    ETH_GOERLI = 'eth-goerli'
}

export enum ContractProxyType {
  EIP1967 = 'eip1967.proxy.implementation',
  EIP1967Beacon = 'eip1967.proxy.beacon',
  EIP1822 = 'eip1822.uups.proxable',
  Zeppelin = 'org.zeppelinos.proxy.implementation',
  Unknown = '',
}
