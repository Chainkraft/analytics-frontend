import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { currencyFormat, numberFormat, percentageFormat } from '../../../../helpers/helpers';
import { ICoinFromPoolDataApi, LiquidityPoolHistory, LiquidityPoolPricingType } from '../../../../interfaces/liquidity-pools.interface';

interface TableCompositionData {
    symbol: string;
    poolBalance: number;
    weight: number;
    usdPrice: number;
}

export function calculateUniswapLiquidityTableData(
    lp: LiquidityPoolHistory,
    latestBalance: { coins: ICoinFromPoolDataApi[]; date: Date }
): TableCompositionData[] {
    const [coin0, coin1] = latestBalance.coins;

    const tableCoins: TableCompositionData[] = [
        {
            symbol: coin0.symbol,
            poolBalance: Number(coin0.poolBalance),
            weight: coin0.weight,
            usdPrice: Number(coin0.usdPrice),
        },
        {
            symbol: coin1.symbol,
            poolBalance: Number(coin1.poolBalance),
            weight: coin1.weight,
            usdPrice: Number(coin1.usdPrice),
        },
    ];

    return tableCoins;
}

const LiquidityCompositionTable = ({ lp }: { lp: LiquidityPoolHistory }) => {

    var balances = lp.balances as { coins: ICoinFromPoolDataApi[]; date: Date }[];
    var underlyingBalances = lp.underlyingBalances as { coins: ICoinFromPoolDataApi[]; date: Date }[];

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

    let tableCoins: TableCompositionData[] = lp.pricingType === LiquidityPoolPricingType.USD ? latestBalance.coins.map(coin => {
        let shiftedBalance = Number(coin.poolBalance) * Math.pow(10, -Number(coin.decimals));
        return {
            symbol: coin.symbol,
            poolBalance: shiftedBalance,
            weight: coin.weight,
            usdPrice: Number(coin.usdPrice),
        }
    }) : calculateUniswapLiquidityTableData(lp, latestBalance);

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
                            <TableCell align="right">{percentageFormat(coin.weight * 100)}</TableCell>
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