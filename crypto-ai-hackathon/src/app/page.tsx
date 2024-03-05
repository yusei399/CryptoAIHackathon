import styles from "./page.module.css";
import SideBar from "@/component/SideBar/SideBar";
import React from "react";
import {fetchAlbumImageUrl} from "@/api/SpotifyApi.server";
import Image from "next/image";
import PlayerSeekbar from "@/component/PlayerSeekbar/PlayerSeekbar";

const Page = () => {
    const imageUrl = fetchAlbumImageUrl();
    const hasPlaylist = true;
    return (
        <main className={styles.main}>
            {hasPlaylist &&
                <div className={styles.blurImage} style={{backgroundImage: `url('${imageUrl}')`}}/>
            }
            <div className={styles.circleContainer}>
                {hasPlaylist
                    ? <PlaylistCircle imageUrl={imageUrl}/>
                    : <RecordCircle/>}
            </div>
            {hasPlaylist &&
                <div className={styles.songTitle}>
                    <div>Bling-Bang-Bang-Born</div>
                    <div>Creepy Nuts</div>
                </div>
            }
            <PlayerSeekbar/>
            <SideBar/>
        </main>
    );
}

const RecordCircle = () => {
    return <>
        <span className={styles.outerCircle} style={{scale: 2.3}}/>
        <span className={styles.outerCircle} style={{scale: 1.05}}/>
        <div className={`${styles.outerCircle} ${styles.micButton}`}>
            <div className={styles.micButtonTitle}>環境音の分析を開始</div>
        </div>
    </>;
}

type PlaylistScreenProps = {
    imageUrl: string,
}

const PlaylistCircle = ({imageUrl}: PlaylistScreenProps) => {
    return <>
        <span className={styles.outerCircle} style={{scale: 2.2}}/>
        <span className={styles.outerCircle} style={{scale: 1.3}}/>
        <div className={styles.outerCircle}>
            <Image src={imageUrl} width={248} height={248} style={{borderRadius: "50%"}} alt={""}/>
        </div>
    </>;
}

export default Page