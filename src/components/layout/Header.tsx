import * as React from 'react';
import {useContext} from 'react';
import {alpha, styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import {Autocomplete, Badge, Container, Link, Menu, MenuItem} from "@mui/material";
import {apiClient, fetcherAxios} from '../../helpers/fetcher-axios';
import useSWR from 'swr';
import {useLocation, useNavigate} from "react-router-dom";
import SubscriptionDialog from "../home/SubscriptionDialog";
import AuthContext from "../auth/AuthContext";
import GppMaybeIcon from '@mui/icons-material/GppMaybe';

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


function NotificationsIcon(props: { color: string }) {
    return null;
}

export default function Header() {
    const pathname = useLocation().pathname

    const pages = [
        {
            label: "Stablecoins",
            active: pathname.startsWith("/stablecoins") || pathname.startsWith("/token"),
            props: {
                href: "/stablecoins",
                disabled: false,
                onClick: () => handleCloseNavMenu
            }
        },
        {
            label: "Subscribe",
            active: pathname.startsWith("/alerts") || pathname.startsWith("/subscribe"),
            props: {
                disabled: false,
                onClick: () => {
                    setSubscriptionDialog(true);
                    handleCloseNavMenu();
                }
            }
        }
    ];

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [searchVisibility, setSearchVisibility] = React.useState<boolean>(false);
    const [subscriptionDialog, setSubscriptionDialog] = React.useState<boolean>(false);

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleSearchIconClick = () => {
        setSearchVisibility(true)
    };

    const handleLogout = () => {
        apiClient.post("/auth/logout")
            .then(() => {})
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                logout();
            });
    };

    const {data: stablecoins} = useSWR<any>(`stablecoins`, fetcherAxios);

    const onSearchQueryChange = (event: object, value: any) => {
        navigate(value.id);
    }

    return (
        <AppBar
            position="relative"
            sx={{backgroundImage: 'none'}}
        >
            <SubscriptionDialog opened={subscriptionDialog} onClose={() => setSubscriptionDialog(false)}/>
            <Container maxWidth="lg">
                <Toolbar disableGutters={true}>
                    <Link href="/" sx={{lineHeight: 1}}>
                        <Box
                            component="img"
                            sx={(theme) => ({
                                height: 39,
                                mr: 2,
                                [theme.breakpoints.down("sm")]: {
                                    height: 33
                                }
                            })}
                            alt="Analytics"
                            src="/logo.png"
                        />
                    </Link>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map(page => (
                            <Button
                                key={page.label}
                                {...page.props}
                                sx={(theme) => ({
                                    px: 2,
                                    color: page.active ? theme.palette.text.disabled : theme.palette.text.primary,
                                    display: 'block'
                                })}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            {user &&
                                <Badge badgeContent={4} color="error">
                                    <MenuIcon/>
                                </Badge>
                            }
                            {!user &&
                                <MenuIcon/>
                            }
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
                                <MenuItem onClick={handleCloseNavMenu} key={page.label}>
                                    <Link
                                        sx={{color: 'white'}}
                                        {...page.props}
                                    >
                                        {page.label}
                                    </Link>
                                </MenuItem>
                            ))}
                            {user &&
                                <div>
                                    <MenuItem onClick={handleCloseNavMenu} key="alerts">
                                        <Badge badgeContent={4} color="error">
                                            <Link href="/alerts">Alerts</Link>
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseNavMenu} key="logout">
                                        <Link onClick={handleLogout}>Log out</Link>
                                    </MenuItem>
                                </div>
                            }
                            {!user &&
                                <MenuItem onClick={handleCloseNavMenu} key="signin">
                                    <Link href="/login" sx={{color: 'white'}}>Sign in</Link>
                                </MenuItem>
                            }
                        </Menu>
                    </Box>

                    {stablecoins &&
                        <Search sx={{
                            display: searchVisibility ? 'flex' : 'none',
                            mx: 1
                        }}>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>

                            <Autocomplete
                                forcePopupIcon={false}
                                options={
                                    stablecoins.data.map((coin: any) => ({
                                        label: `${coin.symbol} - ${coin.name}`,
                                        id: `tokens/${coin.slug}`
                                    }))
                                }
                                onChange={onSearchQueryChange}
                                sx={{width: 220}}
                                renderInput={(params) => {
                                    const {InputLabelProps, InputProps, ...rest} = params;
                                    return <StyledInputBase {...params.InputProps} {...rest}
                                                            placeholder="Search..."/>
                                }}
                            />
                        </Search>
                    }

                    <IconButton
                        onClick={handleSearchIconClick}
                        sx={{display: searchVisibility ? 'none' : 'flex'}}
                        aria-label="search"
                        color="inherit">
                        <SearchIcon/>
                    </IconButton>

                    {user &&
                        <React.Fragment>
                            <IconButton aria-label={"New alerts"}
                                        sx={{display: {xs: 'none', md: 'block'}}}>
                                <Badge badgeContent={4} color="error">
                                    <GppMaybeIcon color="action"/>
                                </Badge>
                            </IconButton>
                            <Button onClick={handleLogout} variant="outlined" sx={{
                                display: {xs: 'none', md: 'block'},
                                marginLeft: 2,
                            }}>
                                Log out
                            </Button>
                        </React.Fragment>
                    }
                    {!user &&
                        <Button variant="outlined" href="/login" sx={{
                            display: {xs: 'none', md: 'block'},
                            marginLeft: 2,
                        }}>
                            Sign in
                        </Button>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}
