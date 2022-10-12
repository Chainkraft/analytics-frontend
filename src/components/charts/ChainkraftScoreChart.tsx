import React from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { grey } from "@mui/material/colors";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const lightGrey = grey[400];

export const data = {
    labels: ["Market cap", "Peg stability", "Chain adoption", "Collateral", "Sentiment"],
    datasets: [
        {
            label: "",
            data: [50, 85, 28, 90, 45],
            backgroundColor: 'rgba(249, 168, 34, 0.8)',
            borderColor: 'rgba(249, 168, 34, 1)',
            borderWidth: 1
        }
    ]
};

let radarOptions = {
    elements: {
        point: {
            radius: 2
        },
    },
    plugins: {
        title: {
            display: true,
            text: "Chainkraft score",
            color: 'white',
            font: {
                size: 16,
            },
        },
        legend: {
            display: false,
        },
    },
    scales: {
        r: {
            min: 0,
            max: 100,
            grid: {
                color: lightGrey,
            },
            angleLines: {
                color: lightGrey,
            },
            ticks: {
                stepSize: 20,
                display: false
            },
            pointLabels: {
                color: lightGrey,
                font: {
                    size: 14,
                },
            }
        }
    },
};

const ChainkraftScoreChart = (props: any) => {
    return <Radar options={radarOptions} data={data} />;
}

export default ChainkraftScoreChart; 
