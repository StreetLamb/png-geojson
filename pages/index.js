import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Layout, Menu, Space, Row, Col, message } from "antd";
import UploadForm from "../components/form.js";
import ResultCard from "../components/resultcard";
import { useRouter } from "next/router";
import { useState } from "react";

const { Header, Footer, Content } = Layout;

export default function Home() {
  const router = useRouter();
  const [result, setResult] = useState({});
  const [isloading, setIsLoading] = useState(false);

  const submitForm = (v) => {
    setIsLoading(true);
    setResult({});
    const { lLat, lLong, uLat, uLong, formData } = v;
    fetch(
      `/api/uploadform?lLat=${lLat}&lLong=${lLong}&uLat=${uLat}&uLong=${uLong}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        message.success("GeoJson data generated!");
        setIsLoading(false);
      })
      .catch((error) => {
        message.error("Something went wrong :(");
        setIsLoading(false);
      });
    // router.push({
    //   pathname: "/",
    //   query: {
    //     lLat,
    //     lLong,
    //     uLat,
    //     uLong,
    //     name,
    //   },
    // });
  };

  return (
    <>
      <Head>
        <title>Generate geojson heatmaps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.logo}>
            <span>ImagetoGeoJson</span>
          </div>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]}>
            {/* <Menu.Item key="home" className={styles.menuitem}>
              How to use
            </Menu.Item> */}
            {/* <Menu.Item key="api">API</Menu.Item> */}
          </Menu>
        </Header>
        <Content className={styles.content}>
          <div className={styles.titlebox}>
            <h2>Convert Geographical heatmaps images to GeoJson format</h2>
          </div>
          <UploadForm onSubmitForm={(v) => submitForm(v)} loading={isloading} />
          <ResultCard result={result} />
        </Content>
        <Footer className={styles.footer}>
          <span>Built by StreetLamb</span>
        </Footer>
      </Layout>
    </>
  );
}
