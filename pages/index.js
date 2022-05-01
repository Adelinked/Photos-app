import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import SearchInput from "../components/SearchInput";
import Photo from "../components/Photo";

import { CircularProgress } from "@mui/material";

import { useAppContext } from "../context";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const { globalState, setGlobalState } = useAppContext();
  const [loadingBottom, setLoadingBottom] = useState(false);
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [dataPage, setDataPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const title = globalState;

  const getData = async (title) => {
    try {
      const data = await axios.get(
        `/api/photos?title=${title}&page=${dataPage}`
      );
      if (title) setPhotos(data.data.msg.results);
      else setPhotos(data.data.msg);
    } catch (error) {
      setError(error.response.data);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 500);
    }

    setLoading(false);
  };

  const getMoreData = async (title) => {
    try {
      const data = await axios.get(
        `/api/photos?title=${title}&page=${dataPage}`
      );
      if (title) setPhotos([...photos, ...data.data.msg.results]);
      else setPhotos([...photos, ...data.data.msg]);
    } catch (error) {
      setDataPage((oldPage) => {
        return oldPage > 1 ? oldPage - 1 : oldPage;
      });
      setError(error.response.data);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 500);
      setLoadingBottom(false);
    }

    setLoadingBottom(false);
    setLoading(false);
  };

  useEffect(() => {
    getData(globalState);
  }, []);

  useEffect(() => {
    if (!loadingBottom) return;
    if (loading) return;
    setDataPage((oldPage) => oldPage + 1);
  }, [loadingBottom]);

  useEffect(() => {
    getMoreData(globalState);
  }, [dataPage]);

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setLoadingBottom(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleChange = (e) => {
    const title = e.target.value;
    setGlobalState(title);
    setLoading(true);

    setPhotos([]);
    setDataPage(1);
    getData(title);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Photos App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.appTitleDiv} style={{ marginBottom: "10px" }}>
          <h1 className={styles.appTitle}>Photos</h1>
          <a
            href="https://unsplash.com/developers"
            target="_blank"
            rel="noreferrer"
            title="Powered by unsplash A+pi"
          >
            <img
              style={{ width: "70px" }}
              src="unsplash.png"
              alt="unsplash logo"
            />
          </a>
        </div>

        <SearchInput handleChange={handleChange} />
        {loading ? (
          <div style={{ marginTop: "10px" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {photos && photos.length > 0 ? (
              <div className={styles.photos}>
                {photos.map((p) => (
                  <Photo key={p.id} {...p} />
                ))}
              </div>
            ) : (
              <div style={{ fontWeight: "600" }}>No results to show</div>
            )}
          </>
        )}
        {showError ? <p>{error}</p> : <p></p>}
        {loadingBottom && (
          <div style={{ marginTop: "10px", width: "80px" }}>
            <CircularProgress style={{ width: "50px" }} />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
