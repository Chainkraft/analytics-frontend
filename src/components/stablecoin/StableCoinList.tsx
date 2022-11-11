import * as React from 'react';
import StableCoinCard from './StableCoinCard';
import {CircularProgress, Container, Grid, Link} from '@mui/material';
import Box from '@mui/material/Box';

import {Link as RouterLink} from 'react-router-dom'
import useSWR from 'swr';
import {fetcherAxios} from '../../helpers/fetcher-axios';
import Typography from "@mui/material/Typography";

const StableCoinList = (props: any) => {

    const {data, error} = useSWR<any>(`stablecoins`, fetcherAxios);

    if (!data) {
        return (
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh'
                }}>
                <CircularProgress size={40} color='secondary'/>
            </Container>);
    }

    return (
        <React.Fragment>
            <Container
                maxWidth="lg"
                sx={{display: 'flex', alignItems: 'center', padding: 2}}
            >
                <Typography variant="h5" sx={{flexGrow: 1}}>Stablecoins</Typography>
                {/*<FormControl sx={{m: 1, minWidth: 120}} size="small">*/}
                {/*    <InputLabel id="demo-select-small">Sort by</InputLabel>*/}
                {/*    <Select*/}
                {/*        labelId="demo-select-small"*/}
                {/*        id="demo-select-small"*/}
                {/*        value={age}*/}
                {/*        label="Sort by"*/}
                {/*        onChange={handleChange}*/}
                {/*    >*/}
                {/*        <MenuItem value={10}>Market cap</MenuItem>*/}
                {/*        <MenuItem value={30}>Volume</MenuItem>*/}
                {/*        <MenuItem value={20}>Peg stability</MenuItem>*/}
                {/*    </Select>*/}
                {/*</FormControl>*/}
            </Container>

            <Container maxWidth="lg">
                <Box
                    component="main"
                    sx={{flexGrow: 1, overflow: 'auto'}}
                >
                    <Grid container spacing={4} justifyContent="flex-start">
                        {data.data.map((coin: any) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                                <Link underline='none' component={RouterLink}
                                      to={`/tokens/${coin.symbol.toLowerCase()}`}>
                                    <StableCoinCard coin={coin}/>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default StableCoinList;