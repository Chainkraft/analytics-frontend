import * as React from 'react';
import {useContext, useMemo} from 'react';
import StableCoinCard from './StableCoinCard';
import {Container, Grid, Link, Skeleton} from '@mui/material';
import Box from '@mui/material/Box';

import {Link as RouterLink} from 'react-router-dom'
import useSWR from 'swr';
import {fetcherAxios} from '../../helpers/fetcher-axios';
import AuthContext from "../auth/AuthContext";
import {NotificationSubscriptions} from "../../interfaces/notifications.inteface";
import {Token} from "../../interfaces/tokens.inteface";

const R = require('ramda');

interface StablecoinList {
    data: Token[];
}

interface SubscribedToken extends Token {
    subscribed: boolean;
}

const sortBySubscriptionAndMarketCap = (a: SubscribedToken, b: SubscribedToken): number => {
    return a.subscribed === b.subscribed
        ? b.current_market_cap - a.current_market_cap
        : Number(b.subscribed) - Number(a.subscribed);
}

const StableCoinList = (props: any) => {

    const {user} = useContext(AuthContext);

    const {data: stablecoins} = useSWR<StablecoinList>(`stablecoins`, fetcherAxios);
    const {data: subscriptions} = useSWR<NotificationSubscriptions>(
        user ? "/notifications/subscriptions" : null,
        fetcherAxios
    );

    const sortedStables = useMemo(() => stablecoins?.data
            ?.map(token => {
                return {...token, subscribed: subscriptions?.tokens?.includes(token._id) ?? false} as SubscribedToken
            })
            ?.sort(sortBySubscriptionAndMarketCap),
        [stablecoins, subscriptions]);

    if (!sortedStables) {
        return (
            <Container maxWidth="lg" sx={{display: 'flex', alignItems: 'center', padding: 2}}>
                <Box
                    component="main"
                    sx={{flexGrow: 1, overflow: 'auto'}}>
                    <Grid container columnSpacing={2} rowSpacing={2} justifyContent="flex-start">
                        {Array.from(Array(40).keys()).map((i: number) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
                                <Skeleton variant="rectangular" height={140}/>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

        );
    }

    return (
        <React.Fragment>
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 2,
                    justifyContent: 'center',
                }}
            >
                <Box component="main" sx={{flexGrow: 1, overflow: 'auto'}}>
                    <Grid
                        container
                        columnSpacing={2}
                        rowSpacing={2}
                        justifyContent="flex-start"
                    >

                        {sortedStables?.map((coin: any) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={coin.slug}>
                                <Link
                                    underline="none"
                                    component={RouterLink}
                                    to={`/tokens/${coin.slug}`}
                                >
                                    <StableCoinCard coin={coin} subscribed={coin.subscribed}/>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>

    );
}

export default StableCoinList;