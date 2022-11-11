import { useTheme } from '@mui/material';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';


const MarketCapChart = (props: any) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
    );

    const theme = useTheme();

    let labels: string[] = [];
    let tokenDataset: number[] = [];

    const marketCapsDataset = props.marketCapHistory.market_caps.slice(-90);

    for (let index = 0; index < marketCapsDataset.length; index++) {
        let element = marketCapsDataset[index];
        labels.push(new Date(element.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
        tokenDataset.push(marketCapsDataset[index].market_cap);
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
                radius: 0
            },
        },
        scales: {
            x: {
                ticks: {
                    color: theme.palette.text.primary,
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    borderColor: theme.palette.text.primary,
                },
            },
            y: {
                // suggestedMin: 0,
                ticks: {
                    color: theme.palette.text.primary,
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    borderColor: theme.palette.text.primary,
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Market cap",
                color: theme.palette.text.primary,
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
        labels: labels,
        datasets: [
            {
                label: props.token.symbol,
                data: tokenDataset,
                borderWidth: 3,
                backgroundColor: theme.palette.secondary.main,
                fill: true
            }
        ],
    };

    return (
        <Line options={options} data={data} />
    );
}


export default MarketCapChart; 