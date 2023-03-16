import * as React from 'react';
import {useState} from 'react';
import {Container, Link, Skeleton, TablePagination} from '@mui/material';
import Box from '@mui/material/Box';
import {
    Notification,
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
import {Link as RouterLink} from "react-router-dom";
import {currencyFormat, percentageFormat} from "../../helpers/helpers";
import useSWR from "swr";
import {fetcherAxios} from "../../helpers/fetcher-axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";

const R = require('ramda');

const isSmartContractNotification = (notification: Notification) => {
    return notification.type === NotificationType.CONTRACT_PROXY_ADMIN_CHANGE ||
        notification.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE;
}

const StablecoinDepegRow = (props: { row: Notification }) => {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    const calculateAvgDepeg = (data: NotificationStablecoinDepegDataSchema): number => {
        return (1 - data.avgPrice) * 100;
    }

    const calculate24hPriceDrop = (data: NotificationStablecoinDepegDataSchema): number => {
        return (1 - data.price / data.prices[0]) * 100;
    }

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
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
                        <WaterfallChartIcon titleAccess={'Smart contract modification'}/>}
                    {row.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE &&
                        <WaterfallChartIcon titleAccess={'Smart contract modification'}/>}
                    {row.type === NotificationType.STABLECOIN_DEPEG &&
                        <WaterfallChartIcon titleAccess={'Stablecoin price depeg'}/>}
                    {row.type === NotificationType.USER_ACCOUNT &&
                        <NewReleasesOutlinedIcon titleAccess={'Account notification'}/>}
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
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
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
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading &&
                                    [...Array(5)].map((x, i) =>
                                        <TableRow>
                                            <TableCell style={{padding: 0}} colSpan={6}>
                                                <Typography variant={"h3"}><Skeleton/></Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                {!isLoading && notificationPage && notificationPage.data.map((row: Notification) => (
                                    row.type === NotificationType.STABLECOIN_DEPEG &&
                                    <StablecoinDepegRow key={row._id} row={row}/>
                                ))}
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