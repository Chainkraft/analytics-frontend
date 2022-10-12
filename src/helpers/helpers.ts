export const currencyFormat = (num: number, fraction = 0) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
}).format(num);

export const pageTitles: { [key: string]: string } = {
    "/": "Stablecoins",
    "/alerts": "Alerts"
};