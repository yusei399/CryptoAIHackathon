"use client"
import styles from "./Home.module.css";
import SideBar from "@/component/SideBar/SideBar";
import React, {useEffect, useRef, useState} from "react";
import {fetchAlbumImageUrl} from "@/api/SpotifyApi.server";
import Image from "next/image";
import PlayerSeekbar from "@/component/PlayerSeekbar/PlayerSeekbar";

type Props = {
    token: string,
}

const Home = ({token}: Props) => {
    const imageUrl = fetchAlbumImageUrl();
    const hasPlaylist = true;

    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [deviceId, setDeviceId] = useState<string>();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: 'CryptoAIHackathon',
                getOAuthToken: async (cb) => {
                    cb(token);
                },
            });

            player.addListener('ready', ({device_id}) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({device_id}) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({message}) => {
                console.error(message);
            });

            player.addListener('authentication_error', ({message}) => {
                console.error(message);
            });

            player.addListener('account_error', ({message}) => {
                console.error(message);
            });

            player.connect().then(success => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            })
            setPlayer(player);
        };
        return () => {
            player?.disconnect();
        };
    }, []);

    return <>
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
    </>;
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

export default Home