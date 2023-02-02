import {List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, {useState} from 'react';
import {apiClient} from '../../helpers/fetcher-axios';
import theme from "../../theme";
import ShieldIcon from "@mui/icons-material/Shield";

const isEmailValid = (email: string) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null;
};

interface SubscriptionProps {
    showDetails?: boolean,
    onSubscribe?: () => void
}

const Subscription = (props: SubscriptionProps) => {

    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [form, setForm] = useState({
        email: "",
        error: ""
    });

    const handleSubmit = async () => {
        setProcessing(true);

        let error: string = isEmailValid(form.email) ? '' : 'Incorrect email.';
        if (error.length === 0) {
            apiClient.post("subscribers/alerting",
                {
                    email: form.email,
                })
                .then((res) => {
                    setForm({...form, error: error});
                    setProcessing(false);
                    setSuccess(true);
                    setServerError(false);
                    if (props.onSubscribe) {
                        props.onSubscribe();
                    }
                })
                .catch((err) => {
                    setForm({...form, error: error});
                    setProcessing(false);
                    setSuccess(false);
                    setServerError(true);
                });

        } else {
            setForm({...form, error: "Sorry, incorrect email."});
            setProcessing(false);
            setSuccess(false);
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, email: e.target.value});
    }

    return (
        <Box
            sx={{
                height: '100%',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

            <Typography variant="h4" align='center'>We're coming soon</Typography>
            {props.showDetails &&
                <Box alignItems={'left'}>
                    <Typography sx={{pt: 2}}>Don't wait until it's too late to save your investment.</Typography>
                    <Typography sx={{display: {xs: 'none', sm: 'block'}}}>We protect against:</Typography>
                    <List dense={true} sx={{
                        pt: 1,
                        display: {
                            xs: 'none',
                            sm: 'block'
                        },
                        '.MuiListItem-root': {
                            paddingLeft: '0',
                            '.MuiListItemIcon-root': {
                                minWidth: '32px'
                            },
                            'svg': {
                                color: theme.palette.secondary.main
                            }
                        }
                    }}>
                        <ListItem>
                            <ListItemIcon><ShieldIcon/></ListItemIcon>
                            <ListItemText>DeFi project rugpulls</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><ShieldIcon/></ListItemIcon>
                            <ListItemText>Stablecoin price depegs</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><ShieldIcon/></ListItemIcon>
                            <ListItemText>Smart contract vulnerabilities</ListItemText>
                        </ListItem>
                    </List>
                </Box>
            }

            <Box component="form">
                <TextField
                    fullWidth
                    id="email"
                    label="Enter your email"
                    type="email"
                    name="email"
                    variant="standard"
                    color="primary"
                    autoComplete="email"
                    value={form.email}
                    error={form.error !== ''}
                    helperText={form.error}
                    onChange={handleEmailChange}
                    sx={{mt: 3}}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={processing}
                    sx={{
                        my: 2,
                        p: 2
                    }}>
                    {processing ? 'Processing...' : 'Subscribe for free'}
                </Button>
            </Box>
            {success && <Typography color='success.main'>Thank you. You are now on our waiting list.</Typography>}
            {serverError && <Typography color='warning.main'>Sorry, an error has occured.</Typography>}
        </Box>
    )
}

export default Subscription;