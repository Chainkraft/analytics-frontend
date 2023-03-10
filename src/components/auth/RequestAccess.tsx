import Stack from '@mui/material/Stack';
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Alert, Container, Grid, Snackbar } from "@mui/material";
import theme from "../../theme";
import { styled } from "@mui/material/styles";
import { apiClient } from "../../helpers/fetcher-axios";

const StackItem = styled(Box)(({ theme }) => ({
    width: '100%',
    '& .MuiTextField-root': {
        width: '100%'
    }
}));

const RequestAccess = () => {

    const formInitialState = {
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: ""
    };
    const [form, setForm] = useState({ ...formInitialState });
    const [formError, setFormError] = useState(new Map<string, string>());
    const [formProcessing, setFormProcessing] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        type formKey = keyof typeof form;
        let errors = new Map<string, string>();
        ['firstName', 'lastName', 'email'].forEach((field: string) => {
            if (!form[field as formKey]) {
                errors.set(field, 'Required field');
            }
        });
        setFormError(errors);

        if (errors.size === 0) {
            setFormProcessing(true);
            apiClient.post("/subscribers", form)
                .then(() => {
                    setForm({ ...formInitialState });
                    setSuccess(true);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                })
                .finally(() => {
                    setFormProcessing(false);
                });
        }
    }

    return (
        <Container maxWidth="lg" sx={{
            py: 5,
            [theme.breakpoints.up('sm')]: {
                minHeight: 'calc(90vh - 110px)'
            }
        }}>
            <Grid container rowSpacing={{ xs: 5, md: 0 }} columnSpacing={{ xs: 0, sm: 5 }}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h3" sx={{ mb: 3 }}>Ready to get started?</Typography>
                    <Typography color={theme.palette.text.secondary}>Please fill out the form to gain early access to our analytics suite.</Typography>
                </Grid>
                <Grid item xs={12} md={8} sx={{
                    display: 'flex',
                    [theme.breakpoints.up('md')]: {
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }}>
                    <Box sx={{
                        width: '100%',
                        [theme.breakpoints.up('md')]: {
                            width: 'min(500px, 80vw)',
                        }
                    }}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <StackItem>
                                    <TextField
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        label="Email address"
                                        variant="standard"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        error={formError.has('email')}
                                        helperText={formError.get('email')}
                                        required
                                    />
                                </StackItem>
                                <StackItem>
                                    <TextField
                                        name="firstName"
                                        autoComplete="given-name"
                                        label="First name"
                                        variant="standard"
                                        value={form.firstName}
                                        error={formError.has('firstName')}
                                        helperText={formError.get('firstName')}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </StackItem>
                                <StackItem>
                                    <TextField
                                        name="lastName"
                                        autoComplete="family-name"
                                        label="Last name"
                                        variant="standard"
                                        value={form.lastName}
                                        error={formError.has('lastName')}
                                        helperText={formError.get('lastName')}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </StackItem>
                                <StackItem>
                                    <TextField
                                        name="phone"
                                        autoComplete="tel"
                                        label="Phone number"
                                        variant="standard"
                                        value={form.phone}
                                        onChange={handleInputChange}
                                        error={formError.has('phone')}
                                        helperText={formError.get('phone')}
                                    />
                                </StackItem>
                                <StackItem>
                                    <TextField
                                        name="company"
                                        autoComplete="organization"
                                        label="Company name"
                                        variant="standard"
                                        value={form.company}
                                        onChange={handleInputChange}
                                        error={formError.has('company')}
                                        helperText={formError.get('company')}
                                    />
                                </StackItem>
                                <StackItem>
                                    <Typography variant="body2" color={theme.palette.text.secondary} sx={{ py: 1 }}>
                                        By clicking submit below, you consent to allow chainkraft.com to store and
                                        process
                                        the information submitted above to provide you the content requested.
                                    </Typography>
                                </StackItem>
                                <StackItem>
                                    <Button
                                        disabled={formProcessing}
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        fullWidth>
                                        {formProcessing ? 'Processing...' : 'Request demo'}
                                    </Button>
                                </StackItem>
                            </Stack>
                        </form>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={success}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}>
                <Alert severity="success">Request sent. We will contact you soon</Alert>
            </Snackbar>
            <Snackbar open={error}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}>
                <Alert severity="error">Unexpected error. Reach out to us directly</Alert>
            </Snackbar>
        </Container>
    );
}

export default RequestAccess;