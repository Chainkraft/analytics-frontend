import {
    Container,
    Grid,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Skeleton
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useSWR from 'swr';
import React, { useContext, useMemo, useState } from 'react';
import { fetcherAxios } from '../../helpers/fetcher-axios';
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import theme from "../../theme";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Divider from "@mui/material/Divider";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ContractNetwork, ContractSummary, ContractSummaryStatus } from "../../interfaces/contracts.interface";
import { shortAddress } from "../../helpers/address.helpers";
import { timeElapsed } from "../../helpers/helpers";
import Button from "@mui/material/Button";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AuthContext from "../auth/AuthContext";

const R = require('ramda');

const StyledBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px'
}));

const StatusIcon = ({ status }: { status: ContractSummaryStatus }) =>
    <React.Fragment>
        {status === ContractSummaryStatus.OK &&
            <CheckCircleOutlineIcon color="success" sx={{ mx: 1 }}></CheckCircleOutlineIcon>
        }
        {status === ContractSummaryStatus.WARNING &&
            <WarningAmberIcon color="warning" sx={{ mx: 1 }}></WarningAmberIcon>
        }
        {status === ContractSummaryStatus.ALARM &&
            <ErrorOutlineIcon color="error" sx={{ mx: 1 }}></ErrorOutlineIcon>
        }
    </React.Fragment>;

const SectionDivider = ({ id, label, status }: { id: string, label: string, status: ContractSummaryStatus }) =>
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

const ComponentLoader = () =>
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

const calculateBlockDiff = (block: number, blockchain: any) => {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(blockchain[ContractNetwork.ETH_MAINNET]! - block);
}

const calculateScore = (summary: ContractSummary) => {
    let score = 0;
    if (summary.proxyPattern.status === ContractSummaryStatus.OK) {
        score++;
    }
    if (summary.sourceCode.status === ContractSummaryStatus.OK) {
        score++;
    }
    if (summary.proofOfTime.status === ContractSummaryStatus.OK) {
        score++;
    }
    return score;
}

const StableCoinDashboard = ({ tokenId }: { tokenId: string }) => {
    const { user } = useContext(AuthContext);
    const [detailedView, setDetailedView] = useState(false);

    const { data: contractData, isLoading: contractDataLoading, error } = useSWR<ContractSummary[]>(
        `contracts/${tokenId}/summary`, fetcherAxios, { shouldRetryOnError: false }
    )

    const { data: latestBlocks, isLoading: latestBlocksLoading } = useSWR<Map<ContractNetwork, number>>(
        () => user ? `blockchains/lastBlocks` : null, fetcherAxios, { shouldRetryOnError: false }
    )
    const summary: ContractSummary = useMemo(() => R.propOr({}, 0, contractData), [contractData]);

    if (error) {
        return <Box />
    }
    if (contractDataLoading) {
        return <ComponentLoader />
    }

    return (
        <StyledBox>
            <Typography variant="h5">Security audit</Typography>
            <Typography sx={{ my: 2 }}>
                We evaluate the code and determine if it follows industry standards and best practices for security.
                This involves reviewing the contract's logic and active transaction monitoring affecting application
                behavior leading to security vulnerabilities.
            </Typography>

            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        padding: 2,
                        minHeight: '220px'
                    }}>
                        <Typography sx={{
                            mb: 2,
                            fontWeight: '500'
                        }}>
                            Security checks
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
                                    <ListItem key="proxy">
                                        <ListItemButton href="#proxy" onClick={() => setDetailedView(true)}>
                                            <ListItemIcon>
                                                <StatusIcon status={summary.proxyPattern.status} />
                                            </ListItemIcon>
                                            <ListItemText primary="Proxy implementation" />
                                            <ListItemIcon>
                                                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key="source-code">
                                        <ListItemButton href="#source-code" onClick={() => setDetailedView(true)}>
                                            <ListItemIcon>
                                                <StatusIcon status={summary.sourceCode.status} />
                                            </ListItemIcon>
                                            <ListItemText primary="Source code" />
                                            <ListItemIcon>
                                                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key="proof-of-time">
                                        <ListItemButton href="#proof-of-time" onClick={() => setDetailedView(true)}>
                                            <ListItemIcon>
                                                <StatusIcon status={summary.proofOfTime.status} />
                                            </ListItemIcon>
                                            <ListItemText primary="Proof of time" />
                                            <ListItemIcon>
                                                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    {user &&
                        <Paper sx={{
                            padding: 2,
                            minHeight: '220px'
                        }}>
                            <Typography mb={2} sx={{
                                fontWeight: '500'
                            }}>
                                Security audit summary
                            </Typography>
                            {summary.proxyPattern.status === ContractSummaryStatus.OK &&
                                <Typography mb={2} variant="body2">
                                    The smart contract is currently considered secure.
                                </Typography>
                            }
                            {summary.proxyPattern.status === ContractSummaryStatus.WARNING &&
                                <Typography mb={2} variant="body2">
                                    The smart contract is currently considered secure, yet due to the presence of the
                                    proxy pattern, constant monitoring of all transactions is required to detect any
                                    modifications in the future.
                                </Typography>
                            }
                            {summary.proxyPattern.status === ContractSummaryStatus.ALARM &&
                                <Typography mb={2} variant="body2">
                                    The smart contract is currently considered unreliable.
                                    Logic of the smart contract has recently changed.
                                    It is recommended to move digital assets out of the project.
                                    We will update status accordingly if more data appears.
                                </Typography>
                            }
                            <Typography variant="body2">
                                Your account has active subscription therefore you will be notified immediately about
                                any changes to the smart contract logic.
                            </Typography>
                        </Paper>
                    }
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
            {user && !detailedView &&
                <Box paddingTop={2} textAlign="center">
                    <Button variant="text" endIcon={<ExpandMoreIcon />} onClick={() => setDetailedView(true)}>
                        Show details
                    </Button>
                </Box>
            }

            {user && detailedView &&
                <React.Fragment>
                    <SectionDivider id={"proxy"}
                        label={"Proxy implementation"}
                        status={summary.proxyPattern.status}></SectionDivider>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12} md={6}>
                            {summary.proxyPattern.status === ContractSummaryStatus.OK &&
                                <Paper sx={{
                                    padding: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    [theme.breakpoints.up('md')]: {
                                        minHeight: '250px'
                                    },
                                }}>
                                    <Typography sx={{
                                        fontWeight: '500'
                                    }}>
                                        No proxy implementation detected
                                    </Typography>
                                </Paper>
                            }
                            {summary.proxyPattern.status !== ContractSummaryStatus.OK &&
                                <Paper sx={{
                                    padding: 2,
                                    minHeight: '250px'
                                }}>
                                    <Typography sx={{
                                        mb: 2,
                                        fontWeight: '500'
                                    }}>
                                        Key information
                                    </Typography>

                                    <List sx={{
                                        padding: 0,
                                        '& .MuiListItem-root': {
                                            px: 0,
                                            py: 0.5
                                        }
                                    }}>
                                        <ListItem key="proxy-pattern">
                                            <ListItemText primary="Proxy pattern" />
                                            <ListItemIcon>
                                                <Typography>{summary.proxyPattern.type}</Typography>
                                            </ListItemIcon>
                                        </ListItem>
                                        <Divider />
                                        <ListItem key="proxy-address">
                                            <ListItemText primary="Proxy contract address" />
                                            <ListItemIcon>
                                                <Link target="_blank" rel="noopener noreferrer"
                                                    href={`https://etherscan.io/address/${summary.proxyPattern.address}`}>
                                                    {shortAddress(summary.proxyPattern.address)}
                                                </Link>
                                            </ListItemIcon>
                                        </ListItem>
                                        <Divider />
                                        <ListItem key="proxy-logic-address">
                                            <ListItemText primary="Logic contract address" />
                                            <ListItemIcon>
                                                <Link target="_blank" rel="noopener noreferrer"
                                                    href={`https://etherscan.io/address/${summary.proxyPattern.implSlot}`}>
                                                    {shortAddress(summary.proxyPattern.implSlot)}
                                                </Link>
                                            </ListItemIcon>
                                        </ListItem>
                                        <Divider />
                                        <ListItem key="proxy-admin-address">
                                            <ListItemText primary="Admin address" />
                                            <ListItemIcon>
                                                <Link target="_blank" rel="noopener noreferrer"
                                                    href={`https://etherscan.io/address/${summary.proxyPattern.adminSlot}`}>
                                                    {shortAddress(summary.proxyPattern.adminSlot)}
                                                </Link>
                                            </ListItemIcon>
                                        </ListItem>
                                    </List>
                                </Paper>
                            }
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{
                                padding: 2,
                                minHeight: '250px'
                            }}>
                                <Typography mb={2} sx={{
                                    fontWeight: '500'
                                }}>
                                    What is Proxy pattern?
                                </Typography>
                                <Typography mb={2} variant="body2">
                                    It enables the creation of upgradeable smart contracts, meaning that the underlying
                                    code of the contract can be changed after it has been deployed to the blockchain.
                                    This is
                                    achieved by creating a proxy contract that acts as an intermediary between the user
                                    and the actual contract.
                                </Typography>
                                <Typography variant="body2">
                                    This pattern can be useful in various scenarios, however it breaks the fundamental
                                    rule of smart contracts - immutability. If the contract's code is changed in an
                                    unexpected or malicious manner, it could result in the loss of funds, data, or both.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <SectionDivider id={"source-code"}
                        label={"Source code"}
                        status={summary.sourceCode.status}></SectionDivider>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{
                                padding: 2,
                                minHeight: '240px'
                            }}>
                                <Typography sx={{
                                    mb: 2,
                                    fontWeight: '500'
                                }}>
                                    Preview
                                </Typography>
                                <List sx={{
                                    padding: 0,
                                    '& .MuiListItem-root': {
                                        px: 0,
                                        py: 0.5
                                    }
                                }}>
                                    <ListItem key="close-size">
                                        <ListItemText primary="Size" />
                                        <ListItemIcon>
                                            <Typography>{summary.sourceCode.size} bytes</Typography>
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider />
                                    <ListItem key="created-by-block">
                                        <ListItemText primary="Created by block" />
                                        <ListItemIcon>
                                            <Link target="_blank" rel="noopener noreferrer"
                                                href={`https://etherscan.io/block/${summary.sourceCode.createdByBlock}`}>
                                                {summary.sourceCode.createdByBlock}
                                            </Link>
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider />
                                    <ListItem key="created-by-address">
                                        <ListItemText primary="Created by address" />
                                        <ListItemIcon>
                                            <Link target="_blank" rel="noopener noreferrer"
                                                href={`https://etherscan.io/address/${summary.sourceCode.createdByAddress}`}>
                                                {shortAddress(summary.sourceCode.createdByAddress)}
                                            </Link>
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider />
                                    <ListItem key="compiler-version">
                                        <ListItemText primary="Compiler version" />
                                        <ListItemIcon>
                                            <Typography>{summary.sourceCode.compilerVersion}</Typography>
                                        </ListItemIcon>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{
                                padding: 2,
                                minHeight: '240px'
                            }}>
                                <Typography mb={2} sx={{
                                    fontWeight: '500'
                                }}>
                                    Why source code should be verified?
                                </Typography>
                                <Typography mb={2} variant="body2">
                                    Publishing the source code enables transparency and allows others to review the code
                                    and verify its functionality. This can help to build trust in the smart contract and
                                    increase its adoption by users.
                                </Typography>
                                <Typography variant="body2">
                                    However, it's important to note that publishing the source code does not necessarily
                                    mean that the code has been verified or that it is secure for use on a blockchain.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <SectionDivider id={"proof-of-time"}
                        label={"Proof of time"}
                        status={summary.proofOfTime.status}></SectionDivider>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                py: 2,
                                paddingLeft: 2,
                                borderLeft: 3,
                                borderColor: 'secondary.main'
                            }}>
                                {latestBlocks &&
                                    <React.Fragment>
                                        <Typography variant="h6">
                                            +{calculateBlockDiff(summary.sourceCode.createdByBlock, latestBlocks) + " "}
                                            block confirmations
                                        </Typography>
                                        <Typography>
                                            Smart contract has been running for
                                            {" " + timeElapsed(summary.proofOfTime.createdByBlockAt)}.
                                        </Typography>
                                    </React.Fragment>
                                }
                                {latestBlocksLoading &&
                                    <React.Fragment>
                                        <Skeleton variant="text" width={150} />
                                        <Skeleton variant="text" width={400} />
                                    </React.Fragment>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                py: 2,
                                paddingLeft: 2,
                                borderLeft: 3,
                                borderColor: 'secondary.main'
                            }}>
                                {latestBlocks &&
                                    <React.Fragment>
                                        <Typography variant="h6">+650K block confirmations</Typography>
                                        <Typography>
                                            Smart contract has not been modified for the last 3 months.
                                        </Typography>
                                    </React.Fragment>
                                }
                                {latestBlocksLoading &&
                                    <React.Fragment>
                                        <Skeleton variant="text" width={150} />
                                        <Skeleton variant="text" width={400} />
                                    </React.Fragment>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
        </StyledBox>);
}

export default StableCoinDashboard;