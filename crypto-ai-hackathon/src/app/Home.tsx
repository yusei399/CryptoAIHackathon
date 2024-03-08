"use client"
import styles from "./Home.module.css";
import SideBar from "@/component/SideBar/SideBar";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import PlayerSeekbar, {PlayerSeekState} from "@/component/PlayerSeekbar/PlayerSeekbar";
import {play} from "@/app/api/spotify/spotify-api";
import Recoding from "@/component/Recoding/Recoding";

type Props = {
    token: string,
    musicId: string,
}

type CurrentTrack = {
    name: string,
    albumImageUrl: string,
    artist: string,
}

const Home = ({token, musicId}: Props) => {
    const hasPlaylist = musicId !== "";

    const [expandState1, setExpandState1] = useState(true);
    const [expandState2, setExpandState2] = useState(false);
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
    const [seekState, setSeekState] = useState<PlayerSeekState | null>(null);
    const [isPaused, setPaused] = useState(true)

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        // 1.05から2.3の範囲で拡大アニメーションを生成
        const animateCircle = () => {
            setExpandState1(prevScale1 => !prevScale1);
            setExpandState2(prevScale2 => !prevScale2);
        };
        const intervalId = setInterval(animateCircle, 1000);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: 'CryptoAIHackathon',
                getOAuthToken: async (cb: (arg0: string) => void) => {
                    cb(token);
                },
                volume: 0.5,
            });
            setPlayer(player);

            player.addListener('ready', ({device_id}: { device_id: string }) => {
                console.log('Ready with Device ID', device_id);
                play(musicId, token, device_id);
            });

            player.addListener('not_ready', ({device_id}: { device_id: string }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({message}: { message: string }) => {
                console.error('initialization_error', message);
            });

            player.addListener('authentication_error', ({message}: { message: string }) => {
                console.error('authentication_error', message);
            });

            player.addListener('account_error', ({message}: { message: string }) => {
                console.error('account_error', message);
            });

            player.addListener("player_state_changed", (state) => {
                if (!state) {
                    // 何も再生していない場合
                    return;
                }
                // console.log("player_state_changed", state)  // テスト用

                // プレイヤーの再生・停止状態を取得
                player?.getCurrentState().then((state) => {
                    setPaused(state?.paused ?? true);
                });

                const track = state.track_window.current_track;
                if (track) {
                    setCurrentTrack({
                        name: track.name,
                        albumImageUrl: track.album.images[0].url,
                        artist: track.artists[0].name,
                    })
                }
                setSeekState(state);
            });

            player.connect().then((success: any) => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            })
        };
        return () => {
            clearInterval(intervalId);
            player?.disconnect();
        };
    }, []);

    return <>
        <a href={""} />
        {hasPlaylist &&
            <div className={styles.blurImage} style={{backgroundImage: `url('${currentTrack?.albumImageUrl ?? ""}')`}}/>
        }
        <div className={styles.circleContainer}>
            {hasPlaylist
                ? <PlaylistCircle imageUrl={currentTrack?.albumImageUrl} expandState1={expandState1}
                                  expandState2={expandState2}/>
                : <RecordCircle/>}
        </div>
        {hasPlaylist &&
            <div className={styles.songTitle}>
                <div>{currentTrack?.name}</div>
                <div>{currentTrack?.artist}</div>
            </div>
        }
        <PlayerSeekbar seekState={seekState}/>
        <SideBar player={player} isPaused={isPaused} setPaused={setPaused}/>
    </>;
}

const RecordCircle = () => {
    return <>
        <span className={styles.outerCircle} style={{scale: 2.3}}/>
        <span className={styles.outerCircle} style={{scale: 1.05}}/>
        <Recoding isIcon={false} />
    </>;
}

type PlaylistScreenProps = {
    imageUrl: string | undefined,
    expandState1: boolean,
    expandState2: boolean,
}

const PlaylistCircle = ({imageUrl, expandState1, expandState2}: PlaylistScreenProps) => {
    return <>
        <span className={styles.outerCircle} style={{
            transform: `scale(${expandState1 ? 1.8 : 2.2})`,
        }}/>
        <span className={styles.outerCircle} style={{
            transform: `scale(${expandState2 ? 1.2 : 1.7})`,
        }}/>
        <div className={styles.outerCircle}>
            {imageUrl && <Image src={imageUrl} width={248} height={248} style={{borderRadius: "50%"}} alt={""}/>}
        </div>
    </>;
}

export default Home