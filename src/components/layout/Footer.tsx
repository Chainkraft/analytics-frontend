import { ButtonGroup, Container, Link } from "@mui/material";
import Box from "@mui/material/Box";
import TwitterIcon from '@mui/icons-material/Twitter';
import theme from "../../theme";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { LinkedIn } from '@mui/icons-material';

export default function Footer() {

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                alignContent: 'center',
                mt: 8,
                mb: 2,
                [theme.breakpoints.only('xs')]: {
                    flexDirection: 'column-reverse',
                    alignContent: 'center',
                    textAlign: 'center'
                }
            }}>
            <Box sx={{
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                [theme.breakpoints.only('xs')]: {
                    display: 'block',
                    mt: 2
                }
            }}>
                <Typography color="text.secondary">Made by</Typography>
                <Link href="https://chainkraft.com" sx={{ lineHeight: 0 }}>
                    <Box
                        component="img"
                        sx={{ height: 24, ml: 1 }}
                        alt="Chainkraft.com"
                        src="/chainkraft.png"
                    />
                </Link>
            </Box>
            <Box>
                <ButtonGroup variant="text" color="inherit" sx={{ "& .MuiInputBase-input": { px: 2 } }}>
                    <Button href="https://analytics.chainkraft.com">Home</Button>
                    <Button href="https://chainkraft.com/blog/">Blog</Button>
                    <Button href="https://chainkraft.com/en/contact">Contact</Button>
                    <Button href="https://twitter.com/chainkraftcom" target="_blank">
                        <TwitterIcon sx={{ mr: 1 }}></TwitterIcon>
                        Twitter
                    </Button>
                    <Button href="https://www.linkedin.com/company/chainkraft/" target="_blank">
                        <LinkedIn sx={{ mr: 1 }}></LinkedIn>
                        LinkedIn
                    </Button>
                </ButtonGroup>
            </Box>
        </Container>
    );
}
