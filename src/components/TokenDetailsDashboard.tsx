import { CircularProgress, Container } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { currencyFormat } from '../helpers/helpers';
import PriceChart from './charts/PriceChart';
import MarketCapChart from './charts/MarketCapChart';
import ChainkraftScoreChart from './charts/ChainkraftScoreChart';
import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcherAxios } from '../helpers/fetcher-axios';
const R = require('ramda');


const TokenDetailsDashboard = (props: any) => {
    let { tokenId } = useParams();

    const { data, error } = useSWR<any>(`stablecoins/${tokenId}`, fetcherAxios)
    console.log('data', data);
    console.log('error', error);

    const EMPTY_OBJECT: any = {};

    const extendedData: any = useMemo(() => R.propOr(EMPTY_OBJECT, 'data', data), [data]);

    const token: any = useMemo(() => R.propOr(EMPTY_OBJECT, 'token', extendedData), [extendedData]);
    const priceHistory: any = useMemo(() => R.propOr(EMPTY_OBJECT, 'priceHistory', extendedData), [extendedData]);
    const marketCapHistory: any = useMemo(() => R.prop('marketCapHistory', extendedData), [extendedData]);

    const name: any = useMemo(() => R.propOr('', 'name', token), [token]);
    const image: any = useMemo(() => R.prop('image', token), [token]);
    const symbol: any = useMemo(() => R.propOr('', 'symbol', token), [token]);


    function renderError() {
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
                    An error has occured.
                </Container>
            </Box>
        );
    }

    function renderLoading() {
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
                    <CircularProgress size={40} color='secondary' />
                </Container>
            </Box>
        );
    }

    if (error) {
        return renderError();
    }
    if (!data) {
        return renderLoading();
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
            <Container sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2
            }} >

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {image && <Box
                        component="img"
                        alt="Coin symbol"
                        src={image}
                        sx={{
                            maxHeight: '50px'
                        }}
                    />}
                    <Typography variant="h5">{name} ({symbol})</Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    mt: 1
                }}>
                    <Typography variant="h5" >${token.current_price}</Typography>

                    {token.price_change_24h > 0 ?
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'success.main'
                        }}>
                            <Box component={TrendingUpIcon} />
                            <Typography variant="body1">(+{currencyFormat(token.price_change_24h, 3)})</Typography>
                        </Box>
                        :
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'warning.main'
                        }}>
                            <Box component={TrendingDownIcon} />
                            <Typography variant="body1">({currencyFormat(token.price_change_24h, 3)})</Typography>
                        </Box>
                    }
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: 1,
                    mt: 2,
                    p: 2,

                }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '60%',
                            flexGrow: 1,
                            p: 1
                        }}
                    >
                        <Typography variant="subtitle2">Overview</Typography>
                        <Typography variant="body1">{token.description}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Backing strategy</Typography>
                        <Typography variant="body1">Crypto-backed</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Regulated</Typography>
                        <Typography variant="body1">{token.regulated ? 'Yes' : 'No data'}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Audits</Typography>
                        <Typography variant="body1">{token.audits ? 'Yes' : 'No data'}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Issuer</Typography>
                        <Typography variant="body1">{token.issuer ? token.issuer : 'No data'}</Typography>

                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%',
                            alignItems: 'center',
                            justifyContent: 'flex-start'

                        }}>
                        <ChainkraftScoreChart token={token} priceHistory={priceHistory} />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '20px',
                        mt: 2
                    }}
                >
                    {token.current_market_cap > 0 &&
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: 'background.paper',
                                borderRadius: '12px',
                                boxShadow: 1,
                                fontWeight: 'bold',
                                p: 2,
                                flexGrow: 1
                            }}
                        >
                            <Typography variant="h6">Market cap</Typography>
                            <Typography variant="h4" color='secondary' sx={{ mt: 2, }}>
                                {currencyFormat(token.current_market_cap)}
                            </Typography>
                        </Box>
                    }

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                            boxShadow: 1,
                            fontWeight: 'bold',
                            p: 2,
                            flexGrow: 1
                        }}
                    >

                        <Typography variant="h6">24h volume</Typography>
                        <Typography variant="h4" color='secondary' sx={{ mt: 2, }}>{currencyFormat(token.volume_24h)}</Typography>



                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                            boxShadow: 1,
                            fontWeight: 'bold',
                            p: 2,
                            flexGrow: 1
                        }}
                    >

                        <Typography variant="h6">Chains</Typography>
                        <Typography variant="h4" color='secondary' sx={{ mt: 2, }}>{token.chains.length}</Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: '12px',
                        boxShadow: 1,
                        fontWeight: 'bold',
                        mt: 2,
                        p: 2
                    }}
                >
                    <PriceChart token={token} priceHistory={priceHistory} />
                </Box>

                {marketCapHistory &&
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                            boxShadow: 1,
                            fontWeight: 'bold',
                            mt: 2,
                            p: 2
                        }}
                    >
                        <MarketCapChart token={token} priceHistory={priceHistory} marketCapHistory={marketCapHistory} />
                    </Box>
                }
            </Container >
        </Box >
    );

}


export default TokenDetailsDashboard; 