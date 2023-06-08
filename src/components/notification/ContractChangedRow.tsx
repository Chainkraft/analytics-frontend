import * as React from 'react';
import {Link} from '@mui/material';
import Box from '@mui/material/Box';
import {Notification, NotificationType} from "../../interfaces/notifications.inteface";
import Collapse from '@mui/material/Collapse';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import moment from "moment";
import {Link as RouterLink} from "react-router-dom";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import {browserAddressLink, browserTxLink, longAddress} from "../../helpers/address.helpers";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

const ContractChangedRow = (props: { row: Notification }) => {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    const getContractEntityName = (): string => {
        if (row.protocol) {
            return row.protocol.name;
        }
        return `${row.token!!.symbol}`;
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
                        {row.token?.image &&
                            <Box
                                component="img"
                                alt="Coin symbol"
                                src={row.token?.image}
                                sx={{
                                    maxHeight: '30px',
                                    mr: 1
                                }}
                            />
                        }
                        {getContractEntityName()}
                    </Link>
                </TableCell>
                <TableCell>
                    {row.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE &&
                        <NoteAltIcon titleAccess={'Smart contract implementation changed'}/>}
                    {row.type === NotificationType.CONTRACT_PROXY_ADMIN_CHANGE &&
                        <NoteAltIcon titleAccess={'Smart contract admin changed'}/>}
                </TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell>{moment(row.createdAt).fromNow()}</TableCell>
                <TableCell>{getContractEntityName()} smart contract was changed</TableCell>
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
                            <Table sx={{maxWidth: 700, mb: 2, 'td, th': {px: 0, py: 0, border: 0}}} size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Network</TableCell>
                                        <TableCell>{row.data.network}</TableCell>
                                    </TableRow>
                                    {row.data.block &&
                                        <TableRow>
                                            <TableCell>Block</TableCell>
                                            <TableCell>
                                                {row.data.block}
                                            </TableCell>
                                        </TableRow>
                                    }
                                    {row.data.txHash &&
                                        <TableRow>
                                            <TableCell>Transaction</TableCell>
                                            <TableCell>
                                                <Link target="_blank" rel="noopener noreferrer"
                                                      href={browserTxLink(row.data.txHash, row.data.network)}>
                                                    {row.data.txHash}
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    }
                                    <TableRow>
                                        <TableCell>Contract</TableCell>
                                        <TableCell>
                                            <Link target="_blank" rel="noopener noreferrer"
                                                  href={browserAddressLink(longAddress(row.contract!!.address), row.data.network)}>
                                                {longAddress(row.contract!!.address)}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Old address</TableCell>
                                        <TableCell>
                                            <Link target="_blank" rel="noopener noreferrer"
                                                  href={browserAddressLink(longAddress(row.data.oldAddress), row.data.network)}>
                                                {longAddress(row.data.oldAddress)}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>New address</TableCell>
                                        <TableCell>
                                            <Link target="_blank" rel="noopener noreferrer"
                                                  href={browserAddressLink(longAddress(row.data.newAddress), row.data.network)}>
                                                {longAddress(row.data.newAddress)}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Typography variant="body2">
                                Recent changes in the smart contract
                                {row.type === NotificationType.CONTRACT_PROXY_IMPL_CHANGE ? ' implementation ' : ' owner '}
                                have raised concerns about its reliability in the short term. The original behavior of
                                the digital asset may not be guaranteed. We advise all users to consider moving their
                                digital assets out of this environment temporarily until the situation is resolved.
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default ContractChangedRow;