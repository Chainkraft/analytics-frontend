import { Skeleton, TableContainer } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

import { styled } from "@mui/material/styles";
import { Container } from '@mui/system';
import { Link as RouterLink } from "react-router-dom";
import useSWR from 'swr';
import { fetcherAxios } from '../../../helpers/fetcher-axios';
import { currencyFormat, dexLogos, dexLpNames } from '../../../helpers/helpers';
import { ShortLiquidityPool } from '../../../interfaces/liquidity-pools.interface';
import { useState } from 'react';


const StyledLink = styled(RouterLink)`
    text-decoration: none;
`;

const PoolsTable = () => {
    const { data: fetchedData } = useSWR<ShortLiquidityPool[]>(`pools/overview`, fetcherAxios)
    const data = fetchedData?.map(pool => ({
        ...pool,
        displayName: pool.name ? pool.name : `${dexLpNames[pool.dex]} ${pool.tokens?.join('/')}`,
    }));

    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (value: any) => {
        setSearchTerm(value);
    };

    if (Array.isArray(data) && data.length === 0) {
        return (<Box />);
    }

    return (
        data ? (
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 1,
                        alignItems: 'start',
                        justifyContent: 'center',
                        marginTop: 3,
                        marginBottom: 3
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'normal',
                            marginBottom: 2,
                            flexShrink: 0,
                        }}
                    >
                        Top liquidity pools
                    </Typography>


                    <TextField
                        placeholder="Search for an asset or pool..."
                        variant="outlined"
                        onChange={(e) => handleChange(e.target.value)}
                        size='small'
                        sx={{
                            width: '30%'
                        }} />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '12px',
                        border: 1,
                        borderColor: '#515151'
                    }}>

                    <TableContainer>
                        <Table sx={{ width: '100%' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Dex</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>TVL</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Warnings</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .filter(pool => pool.displayName?.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
                                    .map((row, index) => (
                                        <TableRow
                                            component={StyledLink}
                                            to={`/pools/${(row.network ?? 'ethereum')}/${row.address}`}
                                            sx={{
                                                '&:hover': { backgroundColor: 'action.hover' },
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                        >
                                            <TableCell align="center">
                                                {++index}
                                            </TableCell>
                                            <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }}>
                                                <Avatar src={dexLogos[row.dex]}
                                                    sx={{ width: 28, height: 28 }} />
                                            </TableCell>
                                            <TableCell>
                                                {row.displayName}
                                            </TableCell>
                                            <TableCell align="right">{row.tvl ? currencyFormat(row.tvl, 0) : ''}</TableCell>
                                            <TableCell align="center">
                                                No
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box >
            </Container >
        ) : (
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
                <Skeleton variant="text" width={300} sx={{ fontSize: '2rem', mb: 2 }} />
                <Skeleton variant="rectangular" width={300} sx={{ fontSize: '2rem', mb: 2 }} />
                <Skeleton variant="rectangular" sx={{ flexGrow: 1, width: '100%' }} height={1000} />
            </Container>
        )
    );
}
export default PoolsTable;
