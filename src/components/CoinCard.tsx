import { Paper, Tooltip, Typography, useTheme } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { PriorityHigh } from "@mui/icons-material";
import { currencyFormat } from "../helpers/helpers";
import Box from "@mui/material/Box";


const CoinCard = (props: any) => {

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
                        <Typography variant="body2" color='text.disabled'>{props.coin.name}</Typography>
                        <Typography variant="body2" color='text.secondary' >{props.coin.symbol.toUpperCase()}</Typography>
                    </Box>

                    {peg ?
                        '' :
                        <Tooltip sx={{
                            marginLeft: 'auto',
                        }} title="This token is OFF PEG.">
                            <Box component={PriorityHigh} sx={{
                                marginLeft: 'auto',
                            }} />
                        </Tooltip>}
                </Box>

                <Typography variant="h5" sx={{ mt: 1 }} >{currencyFormat(props.coin.current_price, 3)}</Typography>
                {props.coin.price_change_24h > 0 ?
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        color: "success.main"
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
                        color: "warning.main"
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