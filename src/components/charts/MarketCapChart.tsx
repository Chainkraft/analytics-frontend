import { alpha, Container, Grid, Paper, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Toolbar from '@mui/material/Toolbar';
import { green, grey, red } from '@mui/material/colors';
import { useParams } from 'react-router';

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
import usdd from "../../responses/usdc-marketcap.json";
import tether from "../../responses/tether-marketcap.json";



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

    let tetherDataset = [];
    for (var i = usdd.length - 1; i >= 0; i--) {
        tetherDataset.push(tether[i].totalCirculating.peggedUSD);
    }


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