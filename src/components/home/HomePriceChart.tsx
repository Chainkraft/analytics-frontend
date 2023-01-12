import {useTheme} from '@mui/material';
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {PriceHistory} from "../../interfaces/tokens.inteface";

const HomePriceChart = () => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Legend
    );

    const token: PriceHistory = {
        token: 'UST',
        gecko_id: 'UST',
        prices: Array.from(Array(30).keys()).map(i => {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return {
                price: i < 20 ? Math.random() * (1 - 0.96) + 0.96 :
                    i == 20 ? 0.95 :
                        i == 21 ? 0.7 :
                            i == 22 ? 0.2 :
                                0.01,
                date: new Date(lastMonth.getTime() + i * 1000 * 60 * 60 * 24)
            }
        })
    };

    const theme = useTheme();

    let labels: string[] = [];
    let tokenDataset: number[] = [];

    let priceDataset = token.prices;

    for (let index = 0; index < priceDataset.length; index++) {
        let element = priceDataset[index];
        labels.push(new Date(element.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}));
        tokenDataset.push(priceDataset[index].price);
    }

    const options = {
        responsive: true,
        interaction: {
            intersect: false,
        },
        elements: {
            point: {
                radius: 0,
                backgroundColor: theme.palette.secondary.main,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: theme.palette.text.primary,
                    font: {
                        size: 12,
                    },
                },
                border: {
                    color: theme.palette.text.primary,
                },
            },
            y: {
                beginAtZero: true,
                suggestedMax: 1,
                ticks: {
                    color: theme.palette.text.primary,
                    font: {
                        size: 14,
                    },
                    stepSize: 0.2
                },
                border: {
                    color: theme.palette.text.primary,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: token.token,
                data: tokenDataset,
                borderWidth: 3,
                borderColor: theme.palette.secondary.main,
                backgroundColor: theme.palette.secondary.main,
            }
        ],
    };

    return (
        <Line options={options} data={data}/>
    );
}

export default HomePriceChart;