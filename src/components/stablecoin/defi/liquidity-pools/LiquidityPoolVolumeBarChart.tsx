import { Box, Typography, useTheme } from '@mui/material';
import { Bar, BarChart, Brush } from 'recharts';
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { currencyFormat } from '../../../../helpers/helpers';
import { LiquidityPoolHistory } from '../../../../interfaces/liquidity-pools.interface';
import CustomizedAxisTick from '../../charts/CustomizedAxisTick';

const LiquidityVolumeBarChart = ({ lp }: { lp: LiquidityPoolHistory }) => {

    let theme = useTheme();

    interface ChartData {
        date: string;
        volumeUSD: number;
    }

    let chartData: ChartData[] = lp.poolDayData.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).map((poolDayData) => {
        return {
            date: new Date(poolDayData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
            volumeUSD: Number(poolDayData.volumeUSD)
        }
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: '12px',
                boxShadow: 1,
                p: 2,
                mt: 2
            }}>
            <Typography variant="h6" sx={{ p: 2 }}>Volume</Typography>

            <Box
                sx={({
                    width: '1',
                    mt: 2,
                    p: 1
                })}>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={chartData}
                    >
                        <XAxis
                            dataKey="date"
                            height={55}
                            stroke="white"
                            tickLine={false}
                            strokeWidth={0.5}
                            tick={<CustomizedAxisTick stroke={theme.palette.text.primary} />}
                        />
                        <YAxis
                            type="number"
                            tickMargin={15}
                            stroke="white"
                            tickLine={false}
                            strokeWidth={0.5}
                            tick={{ fill: theme.palette.text.primary }}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat("en-US", {
                                    notation: "compact",
                                    compactDisplay: "short",
                                }).format(value)}
                        />
                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}
                            formatter={(value: any, name: any) => {
                                return [currencyFormat(value), "Volume"];
                            }}
                            cursor={{ fill: theme.palette.secondary.main, fillOpacity: 0.3 }}
                        />

                        <Bar

                            dataKey="volumeUSD"
                            fill={theme.palette.secondary.main}
                            fillOpacity={0.8}
                        />
                        <Brush alwaysShowText={false} dataKey="date"
                            fill={theme.palette.background.paper}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}


export default LiquidityVolumeBarChart; 