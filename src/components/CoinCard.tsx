import { Paper, Tooltip, Typography, useTheme } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { PriorityHigh } from "@mui/icons-material";
import { currencyFormat } from "../helpers/helpers";
import Box from "@mui/material/Box";
import { green, grey, red } from '@mui/material/colors';
import { Link } from "react-router-dom";


const CoinCard = (props: any) => {

    const theme = useTheme();

    const darkGrey = grey[600];
    const lightGrey = grey[400];
    const lighterGrey = grey[300];

    const peg = props.coin.current_price > 0.95 && props.coin.current_price < 1.05;

    return (
        <Paper variant='outlined'
            sx={{
                minWidth: 200,
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 2
                }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Box
                        component="img"
                        alt="Coin symbol"
                        src={props.coin.image}
                        sx={{
                            maxHeight: '50px'
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <Typography variant="body2" color={darkGrey}>{peg} {props.coin.name}</Typography>
                        <Typography variant="body2" color={lightGrey} >{props.coin.symbol.toUpperCase()}</Typography>
                    </Box>

                    {peg ?
                        '' :
                        <Tooltip sx={{
                            marginLeft: 'auto',
                        }} title="This token is OFF PEG.">
                            <Box component={PriorityHigh} sx={{
                                marginLeft: 'auto',
                                color: grey[500]
                            }} />
                        </Tooltip>}
                </Box>

                <Typography variant="h5" color={lighterGrey} sx={{ mt: 1 }} >{currencyFormat(props.coin.current_price, 3)}</Typography>
                {props.coin.price_change_24h > 0 ?
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        color: green[500]
                    }}>
                        <Box component={TrendingUpIcon} />
                        <Typography variant="body2">+{currencyFormat(props.coin.price_change_24h, 3)}</Typography>
                        <Typography variant="body2">since yesterday</Typography>
                    </Box>
                    :
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        color: red[500]
                    }}>
                        <Box component={TrendingDownIcon} />
                        <Typography variant="body2" >{currencyFormat(props.coin.price_change_24h, 3)}</Typography>
                        <Typography variant="body2" >since yesterday</Typography>
                    </Box>
                }
            </Box>
        </Paper >
    );
}


export default CoinCard; 