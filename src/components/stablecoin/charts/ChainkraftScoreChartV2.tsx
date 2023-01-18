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

    let marketCaps: number[] = score.marketCaps;
    let marketCapIndex = marketCaps.indexOf(token.current_market_cap);
    if (marketCapIndex === -1) {
        marketCaps.push(token.current_market_cap);
        marketCaps.sort((n1, n2) => n1 - n2);
        marketCapIndex = marketCaps.indexOf(token.current_market_cap);
    }

    let marketCapScore = Math.round(marketCapIndex * 100 / marketCaps.length);

    let volumes: number[] = score.volumes;
    let volumeIndex = volumes.indexOf(token.volume_24h);
    if (volumeIndex === -1) {
        volumes.push(token.volume_24h);
        volumes.sort((n1, n2) => n1 - n2);
        volumeIndex = volumes.indexOf(token.volume_24h);
    }

    let volumeScore = Math.round(volumeIndex * 100 / volumes.length);

    let chains: number[] = score.chains;
    let chainIndex = chains.indexOf(token.chains.length);
    if (chainIndex === -1) {
        chains.push(token.chains.length);
        chains.sort((n1, n2) => n1 - n2);
        chainIndex = chains.indexOf(token.chains.length);
    }

    let chainAdoptionScore = Math.round(chainIndex * 100 / chains.length);

    const sortedPrices = priceHistory.prices
        .sort((objA, objB) => new Date(objB.date).getTime() - new Date(objA.date).getTime())
        .map(value => value.price)
        .slice(0, 30);
    const meanValue: number = 1;
    const usePopulation = false;

    const tokenPriceDeviation = Math.sqrt(
        sortedPrices.reduce((acc, val) => acc.concat((val - meanValue) ** 2), [] as number[]).reduce((acc, val) => acc + val, 0) /
        (sortedPrices.length - (usePopulation ? 0 : 1)),
    );

    let priceDeviations: number[] = score.priceDeviations;
    let deviationIndex = priceDeviations.indexOf(tokenPriceDeviation);
    if (deviationIndex === -1) {
        priceDeviations.push(tokenPriceDeviation);
        priceDeviations.sort((n1, n2) => n1 - n2);
        deviationIndex = priceDeviations.indexOf(tokenPriceDeviation);
    }

    let stabilityScore = 100 - Math.round(deviationIndex * 100 / priceDeviations.length);

    return [
        {
            subject: "Peg stability",
            value: stabilityScore,
            fullMark: 100,
        },
        {
            subject: "Market cap",
            value: marketCapScore,
            fullMark: 100,
        },

        {
            subject: "Chain adoption",
            value: chainAdoptionScore,
            fullMark: 100,
        },
        {
            subject: "Volume",
            value: volumeScore,
            fullMark: 100,
        },

    ]
};


const ChainkraftScoreChartV2 = (props: any) => {

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
                    <Tooltip contentStyle={{ backgroundColor: theme.palette.primary.main }}
                    />
                </RadarChart>
            </ResponsiveContainer >);
    }
}

export default ChainkraftScoreChartV2; 
