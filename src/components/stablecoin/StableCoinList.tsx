import * as React from 'react';
import StableCoinCard from './StableCoinCard';
import { Container, Grid, Link, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';

import { Link as RouterLink } from 'react-router-dom'
import useSWR from 'swr';
import { fetcherAxios } from '../../helpers/fetcher-axios';

const StableCoinList = (props: any) => {

    const { data, error } = useSWR<any>(`stablecoins`, fetcherAxios);

    if (!data) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Grid container columnSpacing={2} rowSpacing={2} justifyContent="flex-start">
                        {Array.from(Array(20).keys()).map((i: number) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
                                <Skeleton variant="rectangular" height={140} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

        );
    }

    return (
        <React.Fragment>
            < Container maxWidth="lg"
                sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Grid container columnSpacing={2} rowSpacing={2} justifyContent="flex-start">
                        {data.data.map((coin: any) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={coin.slug}>
                                <Link underline='none' component={RouterLink}
                                    to={`/tokens/${coin.slug}`}>
                                    <StableCoinCard coin={coin} />
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container >
        </React.Fragment >
    );
}

export default StableCoinList;