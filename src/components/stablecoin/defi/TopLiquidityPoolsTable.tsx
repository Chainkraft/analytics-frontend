import { TablePagination } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import React from 'react';
import useSWR from 'swr';
import { fetcherAxios } from '../../../helpers/fetcher-axios';
import { currencyFormat } from '../../../helpers/helpers';
import { ShortLiquidityPool } from '../../../interfaces/liquidity-pools.interface';

const TopLiquidityPoolsTable = (props: any) => {
    const { data } = useSWR<ShortLiquidityPool[]>(`pools/token/${props.token}`, fetcherAxios)
    // const [page, setPage] = React.useState(1);

    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (!data) {
        return (<Box />);
    }

    if (Array.isArray(data) && data.length === 0) {
        return (<Box />);
    }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                bgcolor: 'background.paper',
                borderRadius: '12px',
                boxShadow: 1,
                fontWeight: 'bold',
                p: 2
            }}>
            {/* <TableContainer component={Paper}> */}
            <Typography variant="h6" sx={{
                alignSelf: 'center',
            }}>Top Liquidity Pools</Typography>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>TVL</TableCell>
                        <TableCell>Dex</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                            <TableRow
                                key={row.name}
                            >
                                <TableCell >
                                    {row.name}
                                </TableCell>
                                <TableCell >{row.tvl ? currencyFormat(row.tvl, 0) : ''}</TableCell>
                                <TableCell >
                                    <Avatar src="/curve.png" />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                sx={{
                    alignSelf: 'center',
                }}
                rowsPerPageOptions={[5]}
                component="div"
                count={data.length}
                rowsPerPage={5}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box >
    );
}
export default TopLiquidityPoolsTable;