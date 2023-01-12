import { Skeleton, Container, Link, Tooltip, ListSubheader, Switch, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';

import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useSWR from 'swr';
import { fetcherAxios } from '../../../../helpers/fetcher-axios';
import { LiquidityPoolHistory, ShortLiquidityPool } from '../../../../interfaces/liquidity-pools.interface';
import { currencyFormat } from '../../../../helpers/helpers';
import React from 'react';

import { useParams } from 'react-router';
import LiquidityCompositionChart from './LiquidityCompositionChart';
import LiquidityCompositionTable from './LiquidityCompositionTable';

const LiquidityPoolsDashboard = () => {
    let { network, address } = useParams();

    const { data, error } = useSWR<LiquidityPoolHistory>(`pools/${network}/address/${address}`, fetcherAxios)

    if (!data) {
        return (<Box />);
    }

    if (error) {
        return (<Box />);
    }

    let poolName = data.name ? data.name : data.balances[0].coins.map((coin) => coin.symbol).join('/');

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2
            }}>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <Box
                    component="img"
                    alt="Coin symbol"
                    src='/curve.png'
                    sx={{
                        maxHeight: '50px'
                    }}
                />
                <Typography variant="h5">{poolName}</Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1
            }}>

                <Typography variant="h6" color="text.secondary">TVL: {currencyFormat(data.usdTotal, 0)}</Typography>

            </Box>


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: 1,
                    p: 2,
                    mt: 2
                }}>
                <Typography variant="h6" sx={{ p: 2 }}>Liquidity composition</Typography>

                <Box
                    sx={(theme) => ({
                        width: '1',
                        mt: 2,
                        p: 1
                    })}>

                    <LiquidityCompositionChart lp={data} />
                </Box>
                <Box sx={{
                    width: '1',
                    p: 2
                }}>
                    <LiquidityCompositionTable lp={data} />
                </Box>
            </Box>
        </Container >
    );

}

export default LiquidityPoolsDashboard;