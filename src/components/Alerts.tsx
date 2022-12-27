import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { apiClient } from '../helpers/fetcher-axios';

const isEmailValid = (email: string) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null;
};

const Alerts = (props: any) => {
    const handleSubmit = async () => {
        setProcessing(true);

        let error: string = isEmailValid(form.email) ? '' : 'Incorrect email.';
        if (error.length === 0) {
            apiClient.post("subscribers/alerting",
                {
                    email: form.email,
                })
                .then((res) => {
                    setForm({ ...form, error: error });
                    setProcessing(false);
                    setSuccess(true);
                    setServerError(false);
                })
                .catch((err) => {
                    setForm({ ...form, error: error });
                    setProcessing(false);
                    setSuccess(false);
                    setServerError(true);
                });

        } else {
            setForm({ ...form, error: "Sorry, incorrect email." });
            setProcessing(false);
            setSuccess(false);
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, email: e.target.value });
    }

    const [form, setForm] = useState({
        email: "",
        error: ""
    });

    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(false);

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }} >
            <Toolbar />
            <Container sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                minHeight: '70vh'
            }} >
                <Typography variant="h3" align='center' >Coming soon.</Typography>
                <Typography variant="subtitle1" maxWidth='80vh' align='center'>Get depeg and price alerts about your stablecoins straight to your inbox.
                    Know about important events early. No rugpulls or crashes will go unnoticed. </Typography>
                <Box component="form">
                    <TextField
                        fullWidth
                        id="email"
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={form.email}
                        error={form.error !== ''}
                        helperText={form.error}
                        onChange={handleEmailChange}
                    />
                    <Button
                        onClick={handleSubmit}
                        fullWidth
                        variant="contained"
                        disabled={processing}
                        sx={{ mt: 2 }} >
                        {processing ? 'Processing...' : "Subscribe"}
                    </Button>
                </Box>
                {success && <Typography color='success.main'>Thank you. You are now on our waiting list.</Typography>}
                {serverError && <Typography color='warning.main'>Sorry, an error has occured.</Typography>}
            </Container >
        </Box>
    );
}


export default Alerts; 