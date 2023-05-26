import { Box, Typography } from '@mui/material';
import {
    ResponsiveContainer, Treemap
} from "recharts";

const SocialTreeMapChart = () => {
    const data = [
        {
            name: 'USDC',
            size: 1_180_000_000
        },
        {
            name: 'USDT',
            size: 436_000_000
        },
        {
            name: 'DAI',
            size: 156_000_000
        },
        {
            name: 'MIM',
            size: 32_000_000
        },
        {
            name: 'FRAX',
            size: 22_450_000
        },
        {
            name: 'USX',
            size: 7_933_000
        },
        {
            name: 'VST',
            size: 6_602_000
        },
        {
            name: 'DSU',
            size: 4_630_000
        },
        {
            name: 'MAI',
            size: 4_147_000
        },
        {
            name: 'nUSD',
            size: 2_744_000
        }
    ]

    const data0101 = [
        {
            name: 'USDT',
            size: 66_256_000_000
        },
        {
            name: 'USDC',
            size: 44_128_000_000
        },
        {
            name: 'BUSD',
            size: 16_578_000_000
        },
        // {
        //     name: 'DAI',
        //     size: 156_000_000
        // },
        // {
        //     name: 'MIM',
        //     size: 32_000_000
        // },
        // {
        //     name: 'FRAX',
        //     size: 22_450_000
        // },
        // {
        //     name: 'USX',
        //     size: 7_933_000
        // },
        // {
        //     name: 'VST',
        //     size: 6_602_000
        // },
        // {
        //     name: 'DSU',
        //     size: 4_630_000
        // },
        // {
        //     name: 'MAI',
        //     size: 4_147_000
        // },
        // {
        //     name: 'nUSD',
        //     size: 2_744_000
        // }
    ]


    const data3103 = [
        {
            name: 'USDT',
            size: 79_834_000_000
        },
        {
            name: 'USDC',
            size: 32_863_000_000
        },
        {
            name: 'BUSD',
            size: 7_626_000_000
        },
    ]


    const COLORS = [
        '#1A9292', //TETHER
        '#3176C7', // USDC
        '#EEB92F', // BUSD
        '#EAB140', // DAI
        '#5656F1', //MIM
        '#000000', // FRAX
        '#FC9C41', // USX
        '#091021', // VST
        '#656a73', // DSU
        '#D3413B', // MAI
        '#A524AA', // NUSD
    ];

    const CustomizedContent = (props: any) => {
        const { root, depth, x, y, width, height, index, colors, name, value } = props;
        console.log(value);

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill:
                            depth < 2
                                ? colors[index % 10]
                                : "none",
                        stroke: "#1a1a2e",
                        // fillOpacity: 0.8,

                        strokeWidth: 1,
                        // strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10)
                    }}
                />
                {depth === 1 ? (
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 7}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={14}
                    >
                        {name}
                    </text>
                ) : null}
                {depth === 1 ? (
                    <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
                        {/* {index + 1} */}
                    </text>
                ) : null}
            </g>
        );
    };



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
                mt: 2,
                mb: 2
            }}>
            <Typography variant="h6" sx={{ p: 2 }}>Top 3 stablecoin distribution 31.03.2023</Typography>

            <Box
                sx={({
                    width: '1',
                    mt: 2,
                    p: 1
                })}>
                <ResponsiveContainer width="100%" height={500}>
                    <Treemap
                        // width={400} 
                        // height={200} 
                        data={data3103}
                        dataKey="size"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomizedContent colors={COLORS} />} />

                    {/* <BarChart
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
                    </BarChart> */}
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}


export default SocialTreeMapChart; 