import * as React from 'react';
import {Link} from '@mui/material';
import Box from '@mui/material/Box';
import {Notification, NotificationStablecoinDepegDataSchema} from "../../interfaces/notifications.inteface";
import Collapse from '@mui/material/Collapse';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import moment from "moment";
import {Link as RouterLink} from "react-router-dom";
import {currencyFormat, percentageFormat} from "../../helpers/helpers";

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
                    <WaterfallChartIcon titleAccess={'Stablecoin price depeg'}/>
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

export default StablecoinDepegRow;