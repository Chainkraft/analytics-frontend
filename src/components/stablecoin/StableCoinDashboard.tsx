import {CircularProgress, Container, Tooltip} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {currencyFormat} from '../../helpers/helpers';
import PriceChart from './charts/PriceChart';
import MarketCapChart from './charts/MarketCapChart';
import ChainkraftScoreChart from './charts/ChainkraftScoreChart';
import useSWR from 'swr';
import React, {useMemo} from 'react';
import {fetcherAxios} from '../../helpers/fetcher-axios';
import WarningIcon from '@mui/icons-material/Warning';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {TokenContractSummary, TokenContractSummaryStatus} from "../../interfaces/token-contract.summary.interface";
import {styled} from "@mui/material/styles";

const R = require('ramda');

const SmartContractSummary = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    boxShadow: '1',
    fontWeight: 'bold',
    padding: theme.spacing(2),
    flexGrow: '1',
    cursor: 'pointer'
}));

const StableCoinDashboard = (props: any) => {
    let {tokenId} = useParams();

    const {data: tokenData, error} = useSWR<any>(`stablecoins/${tokenId}`, fetcherAxios)
    const {data: contractsSummary} = useSWR<TokenContractSummary>(`contracts/${tokenId}/summary`, fetcherAxios, {shouldRetryOnError: false})

    const EMPTY_OBJECT: any = {};

    const extendedData: any = useMemo(() => R.propOr(EMPTY_OBJECT, 'data', tokenData), [tokenData]);

    const token: any = useMemo(() => R.propOr(EMPTY_OBJECT, 'token', extendedData), [extendedData]);
    const priceHistory: any = useMemo(() => R.propOr(EMPTY_OBJECT, 'priceHistory', extendedData), [extendedData]);
    const marketCapHistory: any = useMemo(() => R.prop('marketCapHistory', extendedData), [extendedData]);

    const name: any = useMemo(() => R.propOr('', 'name', token), [token]);
    const image: any = useMemo(() => R.prop('image', token), [token]);
    const symbol: any = useMemo(() => R.propOr('', 'symbol', token), [token]);


    function renderError() {
        return (
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    p: 2
                }}>
                An error has occurred.
            </Container>
        );
    }

    function renderLoading() {
        return (
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    p: 2
                }}>
                <CircularProgress size={40} color='secondary'/>
            </Container>
        );
    }

    if (error) {
        return renderError();
    }
    if (!tokenData) {
        return renderLoading();
    }

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
                <Typography variant="h5">${token.current_price}</Typography>

                {token.price_change_24h > 0 ?
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '5px',
                        color: 'success.main'
                    }}>
                        <Box component={TrendingUpIcon}/>
                        <Typography variant="body1">(+{currencyFormat(token.price_change_24h, 3)})</Typography>
                    </Box>
                    :
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '5px',
                        color: 'error.main'
                    }}>
                        <Box component={TrendingDownIcon}/>
                        <Typography variant="body1">({currencyFormat(token.price_change_24h, 3)})</Typography>
                    </Box>
                }
            </Box>

            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: 1,
                    mt: 2,
                    p: 2,
                    [theme.breakpoints.down("sm")]: {
                        flexDirection: 'column-reverse',
                    }
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1
                    }}
                >
                    <Typography variant="subtitle2">Overview</Typography>
                    <Typography variant="body1">{token.description}</Typography>
                    <Typography variant="subtitle2" sx={{mt: 2}}>Backing strategy</Typography>
                    <Typography variant="body1">Crypto-backed</Typography>
                    <Typography variant="subtitle2" sx={{mt: 2}}>Regulated</Typography>
                    <Typography variant="body1">{token.regulated ? 'Yes' : 'No data'}</Typography>
                    <Typography variant="subtitle2" sx={{mt: 2}}>Audits</Typography>
                    <Typography variant="body1">{token.audits ? 'Yes' : 'No data'}</Typography>
                    <Typography variant="subtitle2" sx={{mt: 2}}>Issuer</Typography>
                    <Typography variant="body1">{token.issuer ? token.issuer : 'No data'}</Typography>
                </Box>
                <Box
                    sx={(theme) => ({
                        [theme.breakpoints.up("sm")]: {
                            minWidth: '40%'
                        }
                    })}>
                    <ChainkraftScoreChart token={token} priceHistory={priceHistory}/>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    mt: 2
                }}
            >
                {contractsSummary && contractsSummary.status === TokenContractSummaryStatus.ALARM &&
                    <Tooltip title="We have detected smart contract changes recently. Subscribe to get details." arrow>
                        <SmartContractSummary>
                            <Typography variant="h6">Smart contracts</Typography>
                            <Typography sx={{mt: 1}}>
                                <PriorityHighIcon fontSize="large" sx={{color: 'error.main'}}></PriorityHighIcon>
                            </Typography>
                        </SmartContractSummary>
                    </Tooltip>
                }
                {contractsSummary && contractsSummary.status === TokenContractSummaryStatus.WARNING &&
                    <Tooltip title="We have detected smart contract warnings. Subscribe to get details." arrow>
                        <SmartContractSummary>
                            <Typography variant="h6">Smart contracts</Typography>
                            <Typography sx={{mt: 1}}>
                                <WarningIcon fontSize="large" sx={{color: 'warning.main'}}></WarningIcon>
                            </Typography>
                        </SmartContractSummary>
                    </Tooltip>
                }
                {contractsSummary && contractsSummary.status === TokenContractSummaryStatus.OK &&
                    <Tooltip title="We have not detected smart contracts anomalies" arrow>
                        <SmartContractSummary>
                            <Typography variant="h6">Smart contracts</Typography>
                            <Typography sx={{mt: 1}}>
                                <VerifiedUserIcon fontSize="large" sx={{color: 'success.main'}}></VerifiedUserIcon>
                            </Typography>
                        </SmartContractSummary>
                    </Tooltip>
                }
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
                        <Typography variant="h4" color='secondary' sx={{mt: 1}}>
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
                    <Typography variant="h4" color='secondary' sx={{mt: 1}}>
                        {currencyFormat(token.volume_24h)}
                    </Typography>
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
                    <Typography variant="h4" color='secondary' sx={{mt: 1}}>
                        {token.chains.length}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: 1,
                    fontWeight: 'bold',
                    mt: 2,
                    p: 2
                }}
            >
                <PriceChart token={token} priceHistory={priceHistory}/>
            </Box>

            {marketCapHistory &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: '12px',
                        boxShadow: 1,
                        fontWeight: 'bold',
                        mt: 2,
                        p: 2
                    }}
                >
                    <MarketCapChart token={token} priceHistory={priceHistory} marketCapHistory={marketCapHistory}/>
                </Box>
            }
        </Container>
    );
}

export default StableCoinDashboard;