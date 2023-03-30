import { orange, green, grey, red } from '@mui/material/colors';
import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#FDFDFD"
        },
        secondary: {
            main: "#FFB83C",
            dark: "#B7741E"
        },
        error: {
            main: "#FF4242"
        },
        warning: {
            main: orange[800]
        },
        success: {
            main: green[500]
        },
        background: {
            paper: "#37383B",
            default: "#2D2D2F"
        },
        text: {
            primary: "#FDFDFD",
            secondary: grey[400],
            disabled: grey[600]
        }
    },
    status: {
        danger: "#FF4242",
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    }
});

declare module '@mui/material' {
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

export default theme;