import { Skeleton, TableContainer } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { styled } from "@mui/material/styles";
import { Container } from '@mui/system';
import { Link as RouterLink } from "react-router-dom";
import useSWR from 'swr';
import { fetcherAxios } from '../../../helpers/fetcher-axios';
import { currencyFormat, dexLogos, dexLpNames } from '../../../helpers/helpers';
import { ShortLiquidityPool } from '../../../interfaces/liquidity-pools.interface';

const StyledLink = styled(RouterLink)`
    text-decoration: none;
`;

const PoolsTable = () => {
    const { data } = useSWR<ShortLiquidityPool[]>(`pools/overview`, fetcherAxios)

    if (Array.isArray(data) && data.length === 0) {
        return (<Box />);
    }

    return (
        data ? (
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        boxShadow: 1,
                        alignItems: 'center',
                        justifyContent: 'start'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'normal',
                            marginBottom: 2,
                            marginTop: 2,
                            flexShrink: 0,
                        }}
                    >
                        Top liquidity pools
                    </Typography>
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
                                                {row.name ? row.name : `${dexLpNames[row.dex]} ${row.tokens?.join('/')}`}
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
                <Skeleton variant="rectangular" sx={{ flexGrow: 1, width: '100%' }} height={1000} />
            </Container>
        )
    );
}
export default PoolsTable;
