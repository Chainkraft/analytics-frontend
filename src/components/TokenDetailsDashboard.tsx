import { alpha, Container, Grid, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Toolbar from '@mui/material/Toolbar';
import { green, grey, red } from '@mui/material/colors';
import { useParams } from 'react-router';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { currencyFormat } from '../helpers/helpers';
import coin from '../responses/stablecoin-details-mim.json';
import PriceChart from './charts/PriceChart';
import MarketCapChart from './charts/MarketCapChart';
import ChainkraftScoreChart from './charts/ChainkraftScoreChart';



const TokenDetailsDashboard = (props: any) => {

    const lightGrey = grey[400];
    let { tokenId } = useParams();

    let token = coin.data.token;
    let priceHistory = coin.data.priceHistory;
    let marketCapHistory = coin.data.marketCapHistory;

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
                    <Box
                        component="img"
                        alt="Coin symbol"
                        src={token.image}
                        sx={{
                            maxHeight: '50px'
                        }}
                    />
                    <Typography variant="h5">{token.name} ({token.symbol.toUpperCase()})</Typography>
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
                            color: green[500]
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
                            color: red[500]
                        }}>
                            <Box component={TrendingDownIcon} />
                            <Typography variant="body1">(+{currencyFormat(token.price_change_24h, 3)})</Typography>
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
                            p: 1
                        }}
                    >
                        <Typography variant="subtitle2">Overview</Typography>
                        <Typography variant="body1">USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Backing strategy</Typography>
                        <Typography variant="body1">Crypto-backed</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Regulated</Typography>
                        <Typography variant="body1">Yes, by New York State Department of Financial Services</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Audits</Typography>
                        <Typography variant="body1">Yes</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Issuer</Typography>
                        <Typography variant="body1">Paxos Global</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%',
                            p: 1,
                            justifyItems: 'stretch'
                        }}>
                        <Box sx={{
                            flexGrow: 10
                        }}>
                            <ChainkraftScoreChart />
                        </Box>
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
                        <Typography variant="h4" color='rgba(249, 168, 34, 1)' sx={{ mt: 2, }}>{currencyFormat(token.current_market_cap)}</Typography>
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

                        <Typography variant="h6">24h volume</Typography>
                        <Typography variant="h4" color='rgba(249, 168, 34, 1)' sx={{ mt: 2, }}>{currencyFormat(token.volume_24h)}</Typography>



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
                        <Typography variant="h4" color='rgba(249, 168, 34, 1)' sx={{ mt: 2, }}>{token.chains.length}</Typography>
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
                    <MarketCapChart token={token} marketCapHistory={marketCapHistory} />
                </Box>
            </Container >
        </Box >
    );
}


export default TokenDetailsDashboard; 