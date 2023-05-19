import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AuthContext from "../auth/AuthContext";
import {apiClient, fetcherAxios} from "../../helpers/fetcher-axios";
import {useNavigate} from "react-router-dom";
import useSWR from "swr";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {NotificationSubscriptions} from "../../interfaces/notifications.inteface";

const NotificationSubscription = (props: { tokenId: string }) => {

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const {data: subscriptions, isLoading} = useSWR<NotificationSubscriptions>(
        user ? "/notifications/subscriptions" : null,
        fetcherAxios
    );
    const [processing, setProcessing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (subscriptions && subscriptions.tokens.includes(props.tokenId)) {
            setSubscribed(true);
        }
    }, [subscriptions]);

    const toggleWatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }

        setProcessing(true);
        subscribed ? unsubscribe(props.tokenId) : subscribe(props.tokenId);
    }

    const subscribe = async (token: string) => {
        await apiClient.post("/notifications/subscriptions", {token})
            .then(() => {
                setSubscribed(true);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    const unsubscribe = async (token: string) => {
        await apiClient.delete("/notifications/subscriptions", {data: {token}})
            .then(() => {
                setSubscribed(false);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    return (
        <React.Fragment>
            {!isLoading &&
                <Button
                    onClick={toggleWatch}
                    variant="outlined"
                    color={subscribed ? "success" : "secondary"}
                    startIcon={subscribed ? <VerifiedUserIcon/> : <AddModeratorIcon/>}
                    disabled={processing}>
                    {subscribed ? 'Subscribed' : 'Watch asset'}
                </Button>
            }
        </React.Fragment>
    );
}

export default NotificationSubscription;