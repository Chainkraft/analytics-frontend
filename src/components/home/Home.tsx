import {Container, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Skeleton} from '@mui/material';
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import theme from "../../theme";
import ShieldIcon from '@mui/icons-material/Shield';
import HomePriceChart from "./HomePriceChart";
import useSWR from "swr";
import {fetcherAxios} from "../../helpers/fetcher-axios";
import {Link as RouterLink} from "react-router-dom";
import Subscription from "./Subscription";

const Home = () => {

    const {data: stablecoins, isLoading} = useSWR<any>(`stablecoins`, fetcherAxios);

    return (
        <Container maxWidth="lg" sx={{marginTop: 5, marginBottom: 12}}>
            <Grid container rowSpacing={{xs: 6, md: 12, lg: 16}} columnSpacing={{xs: 0, md: 4, lg: 8}}>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h3" component="h1">
                            Crypto
                            <Typography variant="h3" component="span"
                                        color={theme.palette.secondary.main}> credibility</Typography><br/>
                            real-time monitor
                        </Typography>
                        <Typography sx={{pt: 2}}>Don't wait until it's too late to save your investment.<br/>We protect
                            against:</Typography>
                        <List dense={true} sx={{
                            pt: 1,
                            '.MuiListItem-root': {
                                paddingLeft: '0',
                                '.MuiListItemIcon-root': {
                                    minWidth: '32px'
                                },
                                'svg': {
                                    color: theme.palette.secondary.main
                                }
                            }
                        }}>
                            <ListItem>
                                <ListItemIcon><ShieldIcon/></ListItemIcon>
                                <ListItemText>DeFi project rugpulls</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><ShieldIcon/></ListItemIcon>
                                <ListItemText>Stablecoin price depegs</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><ShieldIcon/></ListItemIcon>
                                <ListItemText>Smart contract vulnerabilities</ListItemText>
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{py: 2}}>
                        <Subscription/>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} sx={{display: {xs: 'none', md: 'inline'}}}>
                    <Box>
                        <HomePriceChart/>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h4" component="h2">
                            <ShieldIcon/> DeFi
                            <Typography variant="h4" component="span"
                                        color={theme.palette.secondary.main}> rugpulls </Typography>
                            alerts
                        </Typography>
                        <Typography sx={{py: 2}}>
                            Keep your investments safe with our advanced rugpull detection tool.
                            We use real-time monitoring to scan liquidity pools and transactions, and developer
                            activity,
                            identifying potential threats and alerting you immediately.
                        </Typography>
                        <Typography>
                            Never fall victim to a rugpull again and take control of your assets with our reliable
                            alerts.
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h4" component="h2">
                            <ShieldIcon/> Stablecoin
                            <Typography variant="h4" component="span"
                                        color={theme.palette.secondary.main}> depeg </Typography>
                            alerts
                        </Typography>
                        <Typography sx={{py: 2}}>
                            Preserving the value of your stablecoin investments is crucial, especially when prices
                            deviate from their pegged value.
                        </Typography>
                        <Typography>
                            That's why we offer real-time monitoring of over 60 of the most widely-used stablecoins.
                            With our smart alerts, you'll be notified immediately if any potential
                            issues arise, allowing you to take prompt action to protect your funds.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container columnSpacing={{xs: 2, md: 2}} rowSpacing={1}>
                        {!isLoading && stablecoins.data.slice(0, 8).map((coin: any, i: number) => (
                            <Grid item key={coin.slug} xs={4} sm={3} sx={{
                                [theme.breakpoints.down("sm")]: {
                                    display: i > 5 ? 'none' : undefined
                                }
                            }}>
                                <Link underline='none' component={RouterLink} to={`/tokens/${coin.slug}`}
                                      title={coin.name}>
                                    <Box
                                        sx={{
                                            padding: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                        <Box component="img" src={coin.image} sx={{maxWidth: '60px'}}/>
                                        <Typography variant="body2" sx={{
                                            mt: 1,
                                            fontWeight: 'bold',
                                            color: theme.palette.text.primary,
                                            textAlign: 'center',
                                        }}>{coin.symbol}</Typography>
                                    </Box>
                                </Link>
                            </Grid>
                        ))}

                        {isLoading && Array.from(Array(8).keys()).map((i: number) => (
                            <Grid item key={i} xs={4} sm={3} sx={{
                                [theme.breakpoints.down("sm")]: {
                                    display: i > 5 ? 'none' : undefined
                                }
                            }}>
                                <Skeleton variant="rectangular" height={100}/>
                            </Grid>
                        ))
                        }
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6} sx={{display: {xs: 'none', md: 'inline'}}}>
                    <Paper elevation={1} sx={{
                        padding: 3,
                        wordBreak: 'break-all',
                        color: '#5e5e5e'
                    }}>
                        608060405234801561001057600080fd5b5060405160208061080d83398101604081815291517f6f72672e7a657070656c696e6f732e70726f78792e696d706c656d656e74617482527f696f6e00000000000000000000000000000000000000000000000000000000006020830152915190819003602
                        <Typography component="span" sx={{color: theme.palette.secondary.main}}>3019020819</Typography>
                        06000805160206107ed8339815191521461009157fe5b6100a381640100000000610104810204565b50604080517f6f72672e7a657070656c696e6f732e70726f78792e
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h4" component="h2">
                            <ShieldIcon/> Smart contract
                            <Typography variant="h4" component="span"
                                        color={theme.palette.secondary.main}> anomalies </Typography>
                        </Typography>
                        <Typography sx={{py: 2}}>
                            Our advanced analytics tool provides valuable insights and alerts regarding potential
                            vulnerabilities in smart contracts utilized in decentralized finance.
                        </Typography>
                        <Typography>
                            By scanning EVM bytecode and monitoring suspicious transactions, our tool allows you to
                            take proactive measures and safeguard your funds before any potential issues arise.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;