import "../styles/globals.css";
import { AppWrapper } from "../context";

function MyApp({ Component, pageProps }) {
  const title = pageProps.title;
  const value = title !== null && title !== undefined ? title : "";
  return (
    <AppWrapper value={value}>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
