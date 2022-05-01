import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { FreeSoloCreateOption } from "../components/SearchInput";
import Movie from "../components/Movie";
import Photo from "../components/Photo";

import { CircularProgress } from "@mui/material";

import { useAppContext } from "../context";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const { globalState, setGlobalState } = useAppContext();
  const [loadingBottom, setLoadingBottom] = useState(false);

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
    } catch (error) {}

    setLoading(false);
  };

  const getMoreData = async (title) => {
    try {
      const data = await axios.get(
        `/api/photos?title=${title}&page=${dataPage}`
      );
      console.log("get more");
      if (title) setPhotos([...photos, ...data.data.msg.results]);
      else setPhotos([...photos, ...data.data.msg]);
    } catch (error) {
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

  const event = (e) => {
    const {
      offsetHeight,
      scrollTop,
      scrollHeight,
      scrollTopMax,
      clientHeight,
    } = e.target.documentElement;

    if (clientHeight + scrollTop === scrollHeight) {
      setLoadingBottom(true);
    }
    /*  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setDataPage((dataPage) => dataPage + 1);
      setLoadingBottom(true);
    }*/
  };

  useEffect(() => {
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleChange = (e) => {
    const title = e.target.innerText;
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
            href="http://www.omdbapi.com/"
            target="_blank"
            rel="noreferrer"
            title="Powered by"
          >
            <img style={{ width: "70px" }} src="omdb_api.png" alt="omdb logo" />
          </a>
        </div>

        <FreeSoloCreateOption handleChange={handleChange} disabled={loading} />
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
              <div>No results to show</div>
            )}
          </>
        )}
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
