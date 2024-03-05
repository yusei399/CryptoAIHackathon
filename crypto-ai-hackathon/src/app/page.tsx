import styles from "./page.module.css";
import SideBar from "@/component/SideBar/SideBar";
import React from "react";
import {fetchAlbumImageUrl} from "@/api/SpotifyApiHelper.server";

const Page = () => {
    const imageUrl = fetchAlbumImageUrl();
    return (
        <main className={styles.main}>
            <div className={styles.blurImage} style={{backgroundImage: `url('${imageUrl}')`}}/>
            <div className={styles.circleContainer}>
                <PlaylistScreen/>
                {/*<RecordScreen/>*/}
            </div>
            <SideBar/>
        </main>
    );
}

const RecordScreen = () => {
    return <>
        <span className={styles.outerCircle} style={{scale: 2.3}}/>
        <span className={styles.outerCircle} style={{scale: 1.05}}/>
        <div className={`${styles.outerCircle} ${styles.micButton}`}>
            <div className={styles.micButtonTitle}>環境音の分析を開始</div>
        </div>
    </>;
}

const PlaylistScreen = () => {
    return <>
        <span className={styles.outerCircle} style={{scale: 2.2}}/>
        <span className={styles.outerCircle} style={{scale: 1.3}}/>
        <div className={`${styles.outerCircle} ${styles.micButton}`}>
            <div className={styles.micButtonTitle}>環境音の分析を開始</div>
        </div>
    </>;
}

export default Page