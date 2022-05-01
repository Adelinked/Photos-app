import "../styles/globals.css";
import { AppWrapper } from "../context";

function MyApp({ Component, pageProps }) {
  const title = pageProps.artist;
  const value =
    title !== null && title !== undefined ? title : "Catch me if you can";
  return (
    <AppWrapper value={value}>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
