import {orange, green, grey, red} from '@mui/material/colors';
import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffffff"
        },
        secondary: {
            main: "#f9A822",
            dark: "rgba(249, 168, 34, 0.8)"
        },
        error: {
            main: red[500]
        },
        warning: {
            main: orange[800]
        },
        success: {
            main: green[500]
        },
        background: {
            default: "#13131e",
            paper: "#1a1a2e"
        },
        text: {
            primary: "#ffffff",
            secondary: grey[400],
            disabled: grey[600]
        }
    },
    status: {
        danger: red[500],
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