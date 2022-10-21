import { Container, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { apiClient } from '../helpers/fetcher-axios';

const Alerts = (props: any) => {

    const handleSubmit = async () => {
        setProcessing(true);
        let error = form.email.includes('@') ? '' : 'Incorrect email.';

        if (error.length == 0) {
            let addEmail = await apiClient.post("users/email",
                {
                    email_address: form.email,
                    status: "subscribed"
                });
            console.log(addEmail);
        }

        setForm({ ...form, error: error });
        setProcessing(false);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        // Updates form state variable setting the message
        setForm({ ...form, email: e.target.value });

    const [form, setForm] = useState({
        email: "",
        error: ""
    });

    const [processing, setProcessing] = useState(false);

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
                <Typography variant="subtitle1" maxWidth='80vh' align='center'>You will be able to get depeg and price alerts about your favourite stablecoins.
                    Know about important events early. No rugpulls or crashes will go unnoticed. </Typography>
                <Box component="form"  >
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
                        {processing ? 'Processing...' : "Notify me"}
                    </Button>

                </Box>
            </Container >
        </Box>
    );
}


export default Alerts; 