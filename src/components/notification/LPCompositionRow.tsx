import * as React from 'react';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import { Notification, NotificationLiquidityPoolCompositionChange } from "../../interfaces/notifications.inteface";
import Collapse from '@mui/material/Collapse';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import moment from "moment";
import { Link as RouterLink } from "react-router-dom";
import { dexLogos, dexLpNames, numberFormat, percentageFormat } from "../../helpers/helpers";
import { PieChart } from '@mui/icons-material';
import { LiquidityPoolHistory } from '../../interfaces/liquidity-pools.interface';

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
                        to={`/pools/${row.liquidityPool?.network}/${row.liquidityPool?.address}?chart=hour`}
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
                    <PieChart titleAccess={'Liquidity pool composition change'} />
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
                                {`Pool: ${row.liquidityPool?.address}`}
                            </Typography>
                            <br />
                            <Typography variant="body2">
                                {`The weight of ${row.data.token} ${weightChange(row.data) < 0 ? 'decreased' : 'increased'} by ${percentageFormat(weightChange(row.data))}.`}
                            </Typography>
                            <Typography variant="body2">
                                {`The current balance of the ${row.data.token} in a pool is ${numberFormat(row.data?.balance, 2)},
                                    which is a ${percentageFormat(currentWeight(row.data))} of the pool.`}
                            </Typography>

                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}

export default LPCompositionRow;