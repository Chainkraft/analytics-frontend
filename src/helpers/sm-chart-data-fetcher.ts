import axios from "axios";
interface ChartData {
    date: string;
    price: number;
    peg: number;
}

export async function fetchTerraUSDPriceData(): Promise<ChartData[]> {
    const startDate = '1651788000';
    const endDate = '1652479200';
    const currency = 'usd';
    const url = `https://api.coingecko.com/api/v3/coins/terrausd/market_chart/range?vs_currency=${currency}&from=${startDate}&to=${endDate}`;

    const response = await axios.get(url);
    const rawData = response.data;

    console.log('response', response);
    const chartData: ChartData[] = rawData.prices.map((price: [number, number]) => {
        const timestamp = price[0];
        const priceValue = price[1];

        const date = new Date(timestamp).toISOString();

        return {
            date,
            price: priceValue,
            peg: 1, // Assuming Terra USD is pegged to 1 USD
        };
    });

    return chartData;
}

