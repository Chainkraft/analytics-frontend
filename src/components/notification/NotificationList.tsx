import * as React from 'react';
import { useState } from 'react';
import { Container, Link, Skeleton, TablePagination } from '@mui/material';
import Box from '@mui/material/Box';
import {
    Notification,
    NotificationLiquidityPoolCompositionChange,
    NotificationPage,
    NotificationStablecoinDepegDataSchema,
    NotificationType
} from "../../interfaces/notifications.inteface";
import Collapse from '@mui/material/Collapse';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import moment from "moment";
import { Link as RouterLink } from "react-router-dom";
import { currencyFormat, dexLogos, dexLpNames, numberFormat, percentageFormat } from "../../helpers/helpers";
import useSWR from "swr";
import { fetcherAxios } from "../../helpers/fetcher-axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { PieChart, PieChartOutline } from '@mui/icons-material';
import { LiquidityPoolHistory } from '../../interfaces/liquidity-pools.interface';

const R = require('ramda');

const isSmartContractNotification = (notification: Notification) => {
    return notification.type === NotificationType.CONTRACT_PROXY_ADMIN_CHANGE ||
        notification.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE;
}

const StablecoinDepegRow = (props: { row: Notification }) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const calculateAvgDepeg = (data: NotificationStablecoinDepegDataSchema): number => {
        return (1 - data.avgPrice) * 100;
    }

    const calculate24hPriceDrop = (data: NotificationStablecoinDepegDataSchema): number => {
        return (1 - data.price / data.prices[0]) * 100;
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <Link
                        component={RouterLink}
                        to={`/tokens/${row.token?.slug}`}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none'
                        }}>
                        <Box
                            component="img"
                            alt="Coin symbol"
                            src={row.token?.image}
                            sx={{
                                maxHeight: '30px',
                                mr: 1
                            }}
                        />
                        {row.token?.name}
                    </Link>
                </TableCell>
                <TableCell>
                    {row.type === NotificationType.CONTRACT_PROXY_ADMIN_CHANGE &&
                        <WaterfallChartIcon titleAccess={'Smart contract modification'} />}
                    {row.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE &&
                        <WaterfallChartIcon titleAccess={'Smart contract modification'} />}
                    {row.type === NotificationType.STABLECOIN_DEPEG &&
                        <WaterfallChartIcon titleAccess={'Stablecoin price depeg'} />}
                    {row.type === NotificationType.USER_ACCOUNT &&
                        <NewReleasesOutlinedIcon titleAccess={'Account notification'} />}
                </TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell>{moment(row.createdAt).fromNow()}</TableCell>
                <TableCell>{`${row.token?.symbol} price has dropped to ${currencyFormat(row.data?.price, 2)}`}</TableCell>
                <TableCell width={'20px'}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Notes
                            </Typography>
                            <Typography variant="body2">
                                {`The price has dropped by ${percentageFormat(calculate24hPriceDrop(row.data))} over the last 24 hours.`}
                            </Typography>
                            {calculateAvgDepeg(row.data) > 2 &&
                                <Typography variant="body2">
                                    {`This stablecoin cannot be considered reliable as its average price deviated from
                                    the pegged value by about ${percentageFormat(calculateAvgDepeg(row.data))}
                                    over the last 14 days.`}
                                </Typography>
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const LPCompositionRow = (props: { row: Notification }) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const notificationBalance = row.liquidityPool?.balances.find(balance => {
        moment(balance.date).isSame(moment(row.data?.date), 'minute')
    })

    const currentWeight = (data: NotificationLiquidityPoolCompositionChange): number => {
        return data.weight * 100;
    }

    const weightChange = (data: NotificationLiquidityPoolCompositionChange): number => {
        return data.weightChange * 100;
    }

    const poolName = (pool: LiquidityPoolHistory): string => {
        return pool.name ? pool.name : `${dexLpNames[pool.dex]} ${pool.balances[0].coins.map((coin) => coin.symbol).join('/')}`;
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <Link
                        component={RouterLink}
                        to={`/pools/${row.liquidityPool?.network}/${row.liquidityPool?.address}`}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none'
                        }}>
                        <Box
                            component="img"
                            alt="Dex symbol"
                            src={dexLogos[row.liquidityPool?.dex ?? '']}
                            sx={{
                                maxHeight: '36px',
                                mr: 1
                            }}
                        />
                        {row.liquidityPool ? poolName(row.liquidityPool) : ''}
                    </Link>
                </TableCell>
                <TableCell>
                    {row.type === NotificationType.LP_COMPOSITION_CHANGE &&
                        <PieChart titleAccess={'Liquidity pool composition change'} />}
                </TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell>{moment(row.createdAt).fromNow()}</TableCell>
                <TableCell>{`${row.data.token} weight ${weightChange(row.data) < 0 ? 'decreased' : 'increased'} to ${percentageFormat(currentWeight(row.data))}`}</TableCell>
                <TableCell width={'20px'}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Notes
                            </Typography>
                            <Typography variant="body2">
                                {`The weight of ${row.data.token} ${weightChange(row.data) < 0 ? 'decreased' : 'increased'} by ${percentageFormat(weightChange(row.data))}.`}
                            </Typography>
                            <Typography variant="body2">
                                {`The current balance of the ${row.data.token} in a pool is ${numberFormat(row.data?.balance, 2)},
                                    which is a ${percentageFormat(currentWeight(row.data))} of the ${row.liquidityPool ? poolName(row.liquidityPool) : ''} pool.`}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const NotificationList = () => {

    const [pageIndex, setPageIndex] = useState(0);
    const {
        data: notificationPage,
        isLoading,
        error
    } = useSWR<NotificationPage>(`notifications?page=${pageIndex}`, fetcherAxios);

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
        setPageIndex(page);
    }

    if (error) {
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
                An error has occurred. Please contact administrator.
            </Container>
        );
    }

    return (
        <React.Fragment>
            <Container maxWidth="lg">

                <Box sx={{
                    display: 'flex',
                    py: 2,
                }}>
                    <Typography variant="h5">Notifications</Typography>
                </Box>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto'
                    }}>

                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Asset</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Severity</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading &&
                                    [...Array(5)].map((x, i) =>
                                        <TableRow>
                                            <TableCell style={{ padding: 0 }} colSpan={6}>
                                                <Typography variant={"h3"}><Skeleton /></Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                {!isLoading && notificationPage && notificationPage.data.map((row: Notification) => {
                                    if (row.type === NotificationType.STABLECOIN_DEPEG) {
                                        return (
                                            <StablecoinDepegRow key={row._id} row={row} />
                                        );
                                    } else if (row.type === NotificationType.LP_COMPOSITION_CHANGE) {
                                        return (
                                            <LPCompositionRow key={row._id} row={row} />
                                        );
                                    } else {
                                        return null; // add a fallback case if you want to handle other cases
                                    }
                                })}
                                {!isLoading && notificationPage?.data?.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography textAlign={'center'}>No notifications received yet.</Typography>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {notificationPage && notificationPage.data.length > 0 &&
                        <TablePagination
                            component={'div'}
                            count={notificationPage.count}
                            rowsPerPage={100}
                            rowsPerPageOptions={[]}
                            page={notificationPage?.currentPage}
                            onPageChange={handlePageChange}
                        />
                    }
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default NotificationList;