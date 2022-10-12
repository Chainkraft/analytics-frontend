import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const PriceChart = (props: any) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const textColor = 'white';

    let labels: string[] = [];
    let tokenDataset: number[] = [];
    const priceDataset = props.priceHistory.prices.length > 90 ? props.priceHistory.prices.slice(-90) : props.priceHistory.prices.slice(-30);

    for (let index = 0; index < priceDataset.length; index++) {
        let element = priceDataset[index];
        labels.push(new Date(element.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
        tokenDataset.push(priceDataset[index].price);
    }

    const options = {
        responsive: true,
        layout: {
            padding: 15,
        },
        interaction: {
            intersect: false,
        },
        elements: {
            point: {
                radius: 0,
                backgroundColor: '#F9A822',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    borderColor: textColor,
                },
            },
            y: {
                suggestedMin: Math.min(...tokenDataset) - 0.05,
                suggestedMax: Math.max(...tokenDataset) + 0.05,
                ticks: {
                    color: textColor,
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    borderColor: textColor,
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Price",
                color: textColor,
                font: {
                    size: 16,
                },
            },
            legend: {
                display: false,
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: props.token.symbol,
                data: tokenDataset,
                borderWidth: 3,
                borderColor: '#F9A822',
                backgroundColor: '#F9A822',
            }
        ],
    };

    return (
        <Line options={options} data={data} />
    );
}


export default PriceChart; 