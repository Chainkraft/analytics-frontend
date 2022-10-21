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
import { CircularProgress, useTheme } from "@mui/material";
import { fetcherAxios } from "../../helpers/fetcher-axios";
import useSWR from "swr";


const ChainkraftScoreChart = (props: any) => {
    ChartJS.register(
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    );

    const { data, error } = useSWR<any>(`scores/`, fetcherAxios)
    console.log('data', data);
    console.log('error', error);

    const theme = useTheme();

    const chartData = {
        labels: ["Peg stability", "Market cap", "Chain adoption", "Volume"],
        datasets: [
            {
                label: "",
                data: [50, 85, 28, 90],
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
                display: false,
                text: "Chainkraft score",
                color: theme.palette.text.primary,
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
                    color: theme.palette.text.secondary,
                },
                angleLines: {
                    color: theme.palette.text.secondary,
                },
                ticks: {
                    stepSize: 20,
                    display: false
                },
                pointLabels: {
                    color: theme.palette.text.secondary,
                    font: {
                        size: 14,
                    },
                }
            }
        },
    };

    // return <CircularProgress size={40} sx={{ m: 10 }} color='secondary' />

    if (!data) {
        return <CircularProgress size={40} sx={{ m: 10 }} color='secondary' />
    }



    return <Radar options={radarOptions} data={chartData} />;
}

export default ChainkraftScoreChart; 
