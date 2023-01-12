import { useTheme } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { currencyFormat, numberFormat, percentageFormat } from '../../../../helpers/helpers';
import { ICoinFromPoolDataApi } from '../../../../interfaces/liquidity-pools.interface';

interface TableCompositionData {
    symbol: string;
    poolBalance: number;
    weight: number;
    usdPrice: number;
}

const LiquidityCompositionTable = (props: any) => {

    var balances = props.lp.balances as { coins: ICoinFromPoolDataApi[]; date: Date }[];
    var underlyingBalances = props.lp.underlyingBalances as { coins: ICoinFromPoolDataApi[]; date: Date }[];

    // check if there are any underlying balances
    let latestBalance;
    if (underlyingBalances.length > 0 && underlyingBalances[0].coins.length > 0) {
        latestBalance = underlyingBalances.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        })[0];
    } else {
        latestBalance = balances.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        })[0];
    }


    let totalBalance = latestBalance.coins.reduce((acc, coin) => acc + Math.floor(parseFloat(coin.poolBalance) / (10 ** parseInt(coin.decimals))), 0);

    let tableCoins: TableCompositionData[] = latestBalance.coins.map(coin => {
        let shiftedBalance = Number(coin.poolBalance) * Math.pow(10, -Number(coin.decimals));
        return {
            symbol: coin.symbol,
            poolBalance: shiftedBalance,
            weight: Number(shiftedBalance) / totalBalance * 100,
            usdPrice: Number(coin.usdPrice),
        }
    });

    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell align="right">Weight</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableCoins.map((coin) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {coin.symbol}
                            </TableCell>
                            <TableCell align="right">{percentageFormat(coin.weight)}</TableCell>
                            <TableCell align="right">{numberFormat(coin.poolBalance, 2)}</TableCell>

                            <TableCell align="right">{currencyFormat(coin.usdPrice, 2)}</TableCell>
                            <TableCell align="right">{currencyFormat(coin.usdPrice * coin.poolBalance)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    );
}


export default LiquidityCompositionTable; 