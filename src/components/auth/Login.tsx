import Stack from '@mui/material/Stack';
import React, {useContext, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Alert, Container, Grid} from "@mui/material";
import theme from "../../theme";
import Divider from "@mui/material/Divider";
import {styled} from "@mui/material/styles";
import {apiClient} from "../../helpers/fetcher-axios";
import AuthContext from "./AuthContext";

const StackItem = styled(Box)(({theme}) => ({
    width: '100%',
    '& .MuiTextField-root': {
        width: '100%'
    }
}));

const Login = () => {

    const {login} = useContext(AuthContext);

    const [form, setForm] = useState({email: "", password: ""});
    const [formProcessing, setFormProcessing] = useState(false);
    const [error, setError] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormProcessing(true);

        apiClient.post("/auth/login", form)
            .then((response) => {
                login(response.data.data);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
            })
            .finally(() => {
                setFormProcessing(false);
            });
    }

    return (
        <Container maxWidth="lg" sx={{
            py: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            [theme.breakpoints.up('sm')]: {
                minHeight: 'calc(90vh - 70px)'
            },
        }}>
            <Grid container rowSpacing={{xs: 7, md: 0}} columnSpacing={{xs: 0, sm: 5, md: 7}}>
                <Grid item xs={12} md={6} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Box sx={{
                        width: 'min(400px, 80vw)',
                        [theme.breakpoints.up('sm')]: {
                            pb: 5
                        }
                    }}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <StackItem>
                                    <Typography>Sign in to continue:</Typography>
                                </StackItem>
                                {error &&
                                    <StackItem>
                                        <Alert severity="error" sx={{my: 2}}>Invalid credentials</Alert>
                                    </StackItem>
                                }
                                <StackItem>
                                    <TextField
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        label="Email address"
                                        variant="standard"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </StackItem>
                                <StackItem>
                                    <TextField
                                        type="password"
                                        name="password"
                                        label="Password"
                                        variant="standard"
                                        value={form.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </StackItem>
                                <StackItem sx={{pt: 2}}>
                                    <Button
                                        disabled={formProcessing}
                                        type="submit"
                                        variant="contained"
                                        fullWidth>
                                        {formProcessing ? 'Signing in...' : 'Sign in'}
                                    </Button>
                                </StackItem>
                            </Stack>
                        </form>
                    </Box>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{display: {xs: 'none', md: 'flex'}}}>
                    OR
                </Divider>
                <Grid item xs={12} display={{xs: 'block', md: 'none'}}>
                    <Divider>OR</Divider>
                </Grid>
                <Grid item xs={12} md={5} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Box sx={{
                        width: 'min(400px, 80vw)',
                        [theme.breakpoints.up('sm')]: {
                            pb: 5
                        }
                    }}>
                        <Typography>Don't have an account?</Typography>
                        <Button href="/invite" variant="contained" color="secondary" size="large" sx={{
                            mt: 2,
                            width: '100%',
                            display: 'block',
                            textAlign: 'center'
                        }}>
                            Request demo
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Login;