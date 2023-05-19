import { Paper, Tooltip, Typography } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { PriorityHigh } from "@mui/icons-material";
import { currencyFormat } from "../../helpers/helpers";
import Box from "@mui/material/Box";
import theme from "../../theme";
import {Token} from "../../interfaces/tokens.inteface";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const StableCoinCard = (props: {coin: Token, subscribed: boolean}) => {
    const peg = props.coin.current_price > 0.95 && props.coin.current_price < 1.05;

    return (
        <Paper
            variant="outlined"
            sx={{
                minWidth: 200,
                borderRadius: 2,
                transition: '0.1s',
                borderColor: 'transparent',
                '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: 'action.hover'
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Box
                        component="img"
                        alt="Coin symbol"
                        src={props.coin.image}
                        sx={{
                            maxHeight: '50px',
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {props.coin.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.coin.symbol.toUpperCase()}
                        </Typography>
                    </Box>
                    {!peg &&
                        <Tooltip
                            sx={{
                                marginLeft: 'auto',
                            }}
                            title="This token is OFF PEG."
                        >
                            <PriorityHigh color="error"></PriorityHigh>
                        </Tooltip>
                    }
                    {props.subscribed &&
                        <Tooltip
                            sx={{
                                marginLeft: 'auto',
                            }}
                            title="Subscribed"
                        >
                            <VerifiedUserIcon color="secondary"></VerifiedUserIcon>
                        </Tooltip>
                    }
                </Box>

                <Typography variant="h5" sx={{ mt: 1 }}>
                    {currencyFormat(props.coin.current_price, 3)}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '5px',
                        color:
                            props.coin.price_change_24h > 0 ? 'success.main' : 'error.main',
                    }}
                >
                    <Box
                        component={
                            props.coin.price_change_24h > 0 ? TrendingUpIcon : TrendingDownIcon
                        }
                    />
                    <Typography variant="body2" title="24h change">
                        {props.coin.price_change_24h > 0 && '+'}
                        {currencyFormat(props.coin.price_change_24h, 3)}
                    </Typography>
                </Box>
            </Box>
        </Paper>

    );
};

export default StableCoinCard;