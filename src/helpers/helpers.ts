import moment from "moment";

export const currencyFormat = (num: number, fraction = 0) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
}).format(num);

export const numberFormat = (num: number, fraction = 0) => new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
}).format(num);

export const percentageFormat = (weight: number) => {
    return weight.toFixed(2) + '%';
}

export const timeElapsed = (date: Date): string => {
    const months = moment().diff(moment(date), 'months');
    if(months > 12) {
        return moment().diff(moment(date), 'years') + " years";
    } else if(months < 12) {
        return months + " months";
    }
    return "1 year";
}

export const pageTitles: { [key: string]: string } = {
    "/": "Stablecoins",
    "/alerts": "Alerts"
};