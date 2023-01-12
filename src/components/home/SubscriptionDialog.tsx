import React, {useState} from 'react';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import {Alert, Dialog, DialogTitle, Snackbar} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Subscription from "./Subscription";

interface SubscriptionDialogProps {
    opened: boolean,
    onClose: () => void
}

const SubscriptionDialog = (props: SubscriptionDialogProps) => {

    const [subscribed, setSubscribed] = useState(false);

    const onSubscribe = () => {
        props.onClose();
        setSubscribed(true);
    }

    return (
        <React.Fragment>
            <Snackbar open={subscribed}
                      onClose={() => setSubscribed(false)}
                      autoHideDuration={6000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert severity="success" sx={{width: '100%'}}>Thank you. You are now on our waiting list.</Alert>
            </Snackbar>
            <Dialog
                onClose={() => props.onClose()}
                aria-labelledby="Subscribe"
                open={props.opened}
                PaperProps={{
                    style: {
                        backgroundColor: '#1a1a2e',
                        backgroundImage: 'none',
                        boxShadow: 'none',
                    },
                }}
            >
                <DialogTitle sx={{m: 0, p: 2}}>
                    <IconButton
                        aria-label="close"
                        onClick={props.onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Subscription showDetails={true} onSubscribe={onSubscribe}/>
                </DialogContent>
            </Dialog>

        </React.Fragment>
    );
}

export default SubscriptionDialog;