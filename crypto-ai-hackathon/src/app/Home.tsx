"use client"
import styles from "./Home.module.css";
import SideBar from "@/component/SideBar/SideBar";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import PlayerSeekbar from "@/component/PlayerSeekbar/PlayerSeekbar";
import {fetchAlbumImageUrl, play} from "@/app/api/spotify/spotify-api";

type Props = {
    token: string,
}

const Home = ({token}: Props) => {
    const hasPlaylist = true;

    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        fetchAlbumImageUrl().then((imageUrl: string) => {
            setImageUrl(imageUrl);
        });

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: 'CryptoAIHackathon',
                getOAuthToken: async (cb: (arg0: string) => void) => {
                    cb(token);
                },
            });
            setPlayer(player);

            player.addListener('ready', ({device_id}: {device_id: string}) => {
                console.log('Ready with Device ID', device_id);

                const playlistId = "3cEYpjA9oz9GiPac4AsH4n";
                play(playlistId, token, device_id);
            });

            player.addListener('not_ready', ({device_id}: {device_id: string}) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({message}: {message: string}) => {
                console.error('initialization_error', message);
            });

            player.addListener('authentication_error', ({message}: {message: string}) => {
                console.error('authentication_error', message);
            });

            player.addListener('account_error', ({message}: {message: string}) => {
                console.error('account_error', message);
            });

            player.addListener("player_state_changed", (state) => {
                console.log("player_state_changed", state)
                if (!state) {
                    return;
                }

                // setTrack(state.track_window.current_track);
                // setPaused(state.paused);
                //
                // player.getCurrentState().then((state) => {
                //     if (!state) {
                //         setActive(false);
                //     } else {
                //         setActive(true);
                //     }
                // });
            });

            player.connect().then((success: any) => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            })
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
                <div>唱</div>
                <div>Ado</div>
            </div>
        }
        <PlayerSeekbar/>
        <SideBar player={player}/>
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