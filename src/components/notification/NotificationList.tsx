import * as React from 'react';
import {useState} from 'react';
import {Container, Skeleton, TablePagination} from '@mui/material';
import Box from '@mui/material/Box';
import {Notification, NotificationPage, NotificationType} from "../../interfaces/notifications.inteface";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useSWR from "swr";
import {fetcherAxios} from "../../helpers/fetcher-axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import StablecoinDepegRow from "./StablecoinDepegRow";
import LPCompositionRow from "./LPCompositionRow";
import ContractChangedRow from "./ContractChangedRow";

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
                                {!isLoading && notificationPage && notificationPage.data.map((row: Notification) => {
                                    if (row.type === NotificationType.STABLECOIN_DEPEG) {
                                        return (
                                            <StablecoinDepegRow key={row._id} row={row}/>
                                        );
                                    } else if (row.type === NotificationType.LP_COMPOSITION_CHANGE) {
                                        return (
                                            <LPCompositionRow key={row._id} row={row}/>
                                        );
                                    } else if (row.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE
                                        || row.type === NotificationType.CONTRACT_PROXY_ADMIN_CHANGE) {
                                        return (
                                            <ContractChangedRow key={row._id} row={row}/>
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