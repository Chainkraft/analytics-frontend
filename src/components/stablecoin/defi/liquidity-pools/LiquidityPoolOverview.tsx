import {
    Container,
    Grid, Paper,
    Skeleton
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useContext, useState } from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { LiquidityPoolHistory, LiquidityPoolSummary, LiquidityPoolSummaryStatus } from '../../../../interfaces/liquidity-pools.interface';
import theme from "../../../../theme";
import AuthContext from '../../../auth/AuthContext';


const R = require('ramda');

const StyledBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px'
}));

const StatusIcon = ({ status }: { status: LiquidityPoolSummaryStatus }) =>
    <React.Fragment>
        {status === LiquidityPoolSummaryStatus.OK &&
            <CheckCircleOutlineIcon color="success" sx={{ mx: 1 }}></CheckCircleOutlineIcon>
        }
        {status === LiquidityPoolSummaryStatus.WARNING &&
            <WarningAmberIcon color="warning" sx={{ mx: 1 }}></WarningAmberIcon>
        }
        {status === LiquidityPoolSummaryStatus.ALARM &&
            <ErrorOutlineIcon color="error" sx={{ mx: 1 }}></ErrorOutlineIcon>
        }
    </React.Fragment>;

const SectionDivider = ({ id, label, status }: { id: string, label: string, status: LiquidityPoolSummaryStatus }) =>
    <React.Fragment>
        <Divider
            id={id}
            sx={{
                marginTop: 4,
                marginBottom: 3
            }}></Divider>

        <Typography variant="h5" sx={{
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center'
        }}>
            {label}
            <StatusIcon status={status}></StatusIcon>
        </Typography>
    </React.Fragment>;

const ComponentLoader = (props: any) =>
    <Container
        maxWidth="lg"
        disableGutters
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
        <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
    </Container>;

const ComponentError = () =>
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
    </Container>;

const calculateLpHealth = (lp: LiquidityPoolHistory): LiquidityPoolSummary => {
    return {
        liquidityDepth: LiquidityPoolSummaryStatus.OK,
        volume: LiquidityPoolSummaryStatus.OK,
        liquidityComposition: LiquidityPoolSummaryStatus.OK,
    }
}

const calculateScore = (summary: LiquidityPoolSummary) => {
    let score = 0;
    if (summary.liquidityDepth === LiquidityPoolSummaryStatus.OK) {
        score++;
    }
    if (summary.liquidityComposition === LiquidityPoolSummaryStatus.OK) {
        score++;
    }
    if (summary.volume === LiquidityPoolSummaryStatus.OK) {
        score++;
    }
    return score;
}

const LiquidityPoolOverview = ({ lp }: { lp: LiquidityPoolHistory }) => {
    const { user } = useContext(AuthContext);
    const [detailedView, setDetailedView] = useState(false);

    let summary = calculateLpHealth(lp);

    return (
        <StyledBox>
            <Typography variant="h5">Risks overview</Typography>
            <Typography sx={{ my: 2 }}>
                We evaluate the economic and smart contract risks of a pool to ensure that it adheres to industry standards and best practices within the DeFi ecosystem. We conduct a thorough review of the contract logic, monitor the active volume and liquidity composition, and assess their impact on the stability of the underlying asset's price.
            </Typography>

            <Grid container rowSpacing={1} columnSpacing={2}>
                {/* <Grid item xs={12} md={6}>
                    <Paper sx={{
                        padding: 2,
                        minHeight: '220px'
                    }}>
                        <Typography sx={{
                            mb: 2,
                            fontWeight: '500'
                        }}>
                            Health checks
                            <Typography display="inline" variant="inherit" sx={{
                                paddingLeft: 1,
                                color: calculateScore(summary) === 3
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main
                            }}>
                                {calculateScore(summary)}/3
                            </Typography>
                        </Typography>
                        <Box sx={{
                            display: 'flex'
                        }}>
                            <Box sx={{
                                [theme.breakpoints.down('sm')]: {
                                    flexGrow: 1
                                }
                            }}>
                                <List sx={{
                                    padding: 0,
                                    '& .MuiListItem-root': {
                                        padding: 0
                                    },
                                    '& .MuiListItemButton-root': {
                                        paddingLeft: 0
                                    },
                                    '& .MuiListItem-root .MuiListItemIcon-root': {
                                        minWidth: '0',
                                        marginLeft: 4,
                                        '&:first-child': {
                                            margin: 0,
                                            minWidth: '40px'
                                        }
                                    }
                                }}>
                                    <ListItem key="tvl">
                                        <ListItemButton href="#tvl" onClick={() => setDetailedView(true)}>
                                            <ListItemIcon>
                                                <StatusIcon status={summary.liquidityDepth} />
                                            </ListItemIcon>
                                            <ListItemText primary="Liquidity depth" />
                                            <ListItemIcon>
                                                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key="volume">
                                        <ListItemButton href="#volume" onClick={() => setDetailedView(true)}>
                                            <ListItemIcon>
                                                <StatusIcon status={summary.volume} />
                                            </ListItemIcon>
                                            <ListItemText primary="Volume stability" />
                                            <ListItemIcon>
                                                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key="liquidity-composition">
                                        <ListItemButton href="#liquidity-composition" onClick={() => setDetailedView(true)}>
                                            <ListItemIcon>
                                                <StatusIcon status={summary.liquidityComposition} />
                                            </ListItemIcon>
                                            <ListItemText primary="Liquidity composition" />
                                            <ListItemIcon>
                                                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                        </Box>
                    </Paper>
                </Grid> */}
                <Grid item xs={12} md={12}>
                    {!user &&
                        <Paper sx={{
                            padding: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            [theme.breakpoints.up('md')]: {
                                minHeight: '220px'
                            },
                            [theme.breakpoints.down('md')]: {
                                backgroundImage: 'none',
                                boxShadow: 'none'
                            }
                        }}>
                            <Box>
                                <Typography sx={{
                                    fontWeight: '500'
                                }}>
                                    Log in to unlock all features
                                </Typography>
                            </Box>
                            <Box>
                                <Button href="/login" variant="contained" color="secondary" sx={{
                                    px: 3,
                                    mt: 2
                                }}>
                                    Sign in
                                </Button>
                            </Box>
                        </Paper>
                    }
                </Grid>
            </Grid>

        </StyledBox >);
}

export default LiquidityPoolOverview;