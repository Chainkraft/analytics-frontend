import * as React from 'react';
import CoinCard from './CoinCard';
import { Container, Grid, Link } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { Link as RouterLink } from 'react-router-dom'

const StablecoinsGrid = (props: any) => {

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
                    {props.coins.map((coin: any) => (
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