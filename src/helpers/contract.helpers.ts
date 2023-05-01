export const shortAddress = (address: string) =>
    address
        ? address.substring(2, 7) + "..." + address.substring(address.length - 5)
        : "";

export const longAddress = (address: string) =>
    address
        ? "0x" + address.slice(-40)
        : "";
