import {ContractNetwork} from "../interfaces/contracts.interface";

export const shortAddress = (address: string) =>
    address
        ? address.substring(2, 7) + "..." + address.substring(address.length - 5)
        : "";

export const longAddress = (address: string) =>
    address
        ? "0x" + address.slice(-40)
        : "";

export const browserTxLink = (txHash: string, network: ContractNetwork): string => {
    switch (network) {
        case ContractNetwork.ETH_GOERLI:
            return `https://goerli.etherscan.io/tx/${txHash}`;
        case ContractNetwork.OPT_MAINNET:
            return `https://optimistic.etherscan.io/tx/${txHash}`;
        case ContractNetwork.ARB_MAINNET:
            return `https://arbiscan.io/tx/${txHash}`;
        case ContractNetwork.MATIC_MAINNET:
            return `https://polygonscan.com/tx/${txHash}`;
        default:
            return `https://etherscan.io/tx/${txHash}`;
    }
}

export const browserAddressLink = (address: string, network: ContractNetwork): string => {
    switch (network) {
        case ContractNetwork.ETH_GOERLI:
            return `https://goerli.etherscan.io/address/${address}`;
        case ContractNetwork.OPT_MAINNET:
            return `https://optimistic.etherscan.io/address/${address}`;
        case ContractNetwork.ARB_MAINNET:
            return `https://arbiscan.io/address/${address}`;
        case ContractNetwork.MATIC_MAINNET:
            return `https://polygonscan.com/address/${address}`;
        default:
            return `https://etherscan.io/address/${address}`;
    }
}
