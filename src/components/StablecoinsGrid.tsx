import * as React from 'react';
import CoinCard from './CoinCard';
import { CircularProgress, Container, Grid, Link } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { Link as RouterLink } from 'react-router-dom'
import useSWR from 'swr';
import { fetcherAxios } from '../helpers/fetcher-axios';

const StablecoinsGrid = (props: any) => {

    const { data, error } = useSWR<any>(`stablecoins`, fetcherAxios)
    console.log('data', data);
    console.log('error', error);

    if (!data) {
        return (
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }} >
                <Toolbar />
                <Container sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    p: 2
                }} >
                    <CircularProgress size={80} color='secondary' />
                </Container >
            </Box >);
    }
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }} >
            <Toolbar />
            <Container maxWidth={false} sx={{
                p: 2
            }} >
                <Grid container spacing={4} justifyContent="flex-start">
                    {data.data.map((coin: any) => (
                        <Grid item xs={12} md={4} sm={6} lg={3} xl={2.4} >
                            <Link underline='none' component={RouterLink} to={`/tokens/${coin.symbol.toLowerCase()}`}>
                                <CoinCard coin={coin} />
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container >
        </Box >
    );

}


export default StablecoinsGrid; 