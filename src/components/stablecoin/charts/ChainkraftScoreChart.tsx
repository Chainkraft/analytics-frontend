import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Tooltip,
    ResponsiveContainer,
    PolarRadiusAxis
} from "recharts";
import { CircularProgress, useTheme } from "@mui/material";
import { fetcherAxios } from "../../../helpers/fetcher-axios";
import useSWR from "swr";
import { PriceHistory, Token } from "../../../interfaces/tokens.inteface";
import { Score } from "../../../interfaces/scores.interface";

const calculateScore = (token: Token, priceHistory: PriceHistory, score: Score) => {
    const { marketCaps, volumes, chains, priceDeviations } = score;

    const getScore = (arr: number[], value: number) => {
        let index = arr.indexOf(value);
        if (index === -1) {
            arr.push(value);
            arr.sort((n1, n2) => n1 - n2);
            index = arr.indexOf(value);
        }
        return Math.round(index * 100 / arr.length);
    };

    const getStandardDeviation = (arr: number[]) => {
        const mean = 1; //arr.reduce((acc, val) => acc + val, 0) / arr.length;
        const usePopulation = false;
        const deviation = Math.sqrt(arr.reduce((acc, val) => acc.concat((val - mean) ** 2), [] as number[]).reduce((acc, val) => acc + val, 0) / (arr.length - (usePopulation ? 0 : 1)));
        return deviation;
    };

    const marketCapScore = getScore(marketCaps, token.current_market_cap);
    const volumeScore = getScore(volumes, token.volume_24h);
    const chainAdoptionScore = getScore(chains, token.chains.length);

    const sortedPrices = priceHistory.prices
        .sort((objA, objB) => new Date(objB.date).getTime() - new Date(objA.date).getTime())
        .map(value => value.price)
        .slice(0, 30);

    const tokenPriceDeviation = getStandardDeviation(sortedPrices);

    const stabilityScore = 100 - Math.round(getScore(priceDeviations, tokenPriceDeviation));

    const scores = [
        { subject: "Peg stability", value: stabilityScore, fullMark: 100 },
        { subject: "Market cap", value: marketCapScore, fullMark: 100 },
        { subject: "Chain adoption", value: chainAdoptionScore, fullMark: 100 },
        { subject: "Volume", value: volumeScore, fullMark: 100 },
    ];

    return scores;
};


const ChainkraftScoreChart = (props: any) => {

    const { data, error } = useSWR<any>(`score`, fetcherAxios)
    console.log('error', error);

    const theme = useTheme();

    if (!data) {
        return <CircularProgress size={40} sx={{ m: 10 }} color='secondary' />
    } else {
        const calculatedScore = calculateScore(props.token, props.priceHistory, data.data);

        return (
            <ResponsiveContainer width="100%" height={500}>
                <RadarChart
                    cy={200}
                    outerRadius='70%'
                    width={500}
                    height={500}
                    data={calculatedScore}
                >
                    <PolarGrid />
                    <PolarRadiusAxis type="number" axisLine={false} tick={false} domain={[0, 100]} />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                        dataKey="value"
                        stroke={theme.palette.secondary.main}
                        fill={theme.palette.secondary.main}
                        fillOpacity={0.6}
                    />
                    <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}
                    />
                </RadarChart>
            </ResponsiveContainer >);
    }
}

export default ChainkraftScoreChart; 
