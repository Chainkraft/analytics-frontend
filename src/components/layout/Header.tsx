import * as React from 'react';
import {alpha, styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import {Container, Link, Menu, MenuItem} from "@mui/material";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.10),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const pages = [
    {label: "Stablecoins", url: "/stablecoins"},
    {label: "DeFi", url: "/defi", disabled: true},
    {label: "Subscribe", url: "/subscribe", disabled: true},
];

export default function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [searchVisibility, setSearchVisibility] = React.useState<boolean>(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleSearchIconClick = () => {
        setSearchVisibility(true)
    };

    return (
        <AppBar
            position="relative"
            sx={{backgroundImage: 'none'}}
        >
            <Container maxWidth="lg">
                <Toolbar>
                    <Link href="/" sx={{lineHeight: 1}}>
                        <Box
                            component="img"
                            sx={{height: 39, mr: 2}}
                            alt="Analytics"
                            src="/logo.png"
                        />
                    </Link>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map(page => (
                            <Button
                                key={page.label}
                                href={page.url}
                                onClick={handleCloseNavMenu}
                                disabled={page.disabled}
                                sx={{my: 2, color: 'white', display: 'block', textAlign: 'center'}}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>

                    <Search sx={{display: {xs: searchVisibility ? 'flex' : 'none', md: 'flex'}}}>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <IconButton
                        onClick={handleSearchIconClick}
                        sx={{display: {xs: searchVisibility ? 'none' : 'flex', md: 'none'}}} aria-label="search"
                        color="inherit">
                        <SearchIcon/>
                    </IconButton>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map(page => (
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        sx={{color: 'white'}}
                                        href={page.url}
                                        textAlign="center"
                                    >
                                        {page.label}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
