import ReactGA from "react-ga4";

export const initGA = () => {
    const isProduction = process.env.NODE_ENV === 'production'
    ReactGA.initialize("G-WD48F43CZB", {
        testMode: !isProduction
    })
}