"use client";
import {Dispatch, SetStateAction, useEffect} from "react";
import styles from "./SideBar.module.css";
import common from "@/app/common.module.css";
import {MouseEventHandler, useState} from "react";

type Props = {
    player: Spotify.Player | null,
    isPaused: boolean,
    setPaused: Dispatch<SetStateAction<boolean>>,
}

const SideBar = ({player, isPaused, setPaused}: Props) => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        // ユーザーのマイクへのアクセスを要求
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                const newMediaRecorder = new MediaRecorder(stream);
                setMediaRecorder(newMediaRecorder);
            })
            .catch(err => console.error('Audio recording error:', err));
    }, []);

    const startRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            mediaRecorder.start();
            console.log('Recording started');

            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    console.log('Recording stopped');
                }
            }, 5000); // 5秒後に録音を停止

            mediaRecorder.ondataavailable = (e) => {
                const audioUrl = URL.createObjectURL(e.data);
                console.log('Recording URL:', audioUrl);
                setAudioUrl(audioUrl); // 録音の確認がしたかった
            };
        }
    };

    return (
        <div className={styles.container}>
            <IconButton content={"mic_none"} fontSize={40} onClick={startRecording}/>
            <div className={styles.bar}/>
            <IconButton content={"skip_previous"} fontSize={36}/>
            <IconButton content={isPaused ? "play_circle_filled" : "pause_circle_filled"} fontSize={48}
                        onClick={async () => {
                            setPaused(!isPaused);
                            if (isPaused) {
                                player?.resume();
                            } else {
                                player?.pause();
                            }
                        }}/>
            <IconButton content={"skip_next"} fontSize={36}/>

            {/* {audioUrl && <audio src={audioUrl} controls />} 録音の確認がしたかったので */}
        </div>
    );
};

type ButtonProps = {
    content: string,
    fontSize: number,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

const IconButton = ({content, fontSize, onClick}: ButtonProps) => {
    return (
        <div className={`${common.materialIcons} ${styles.icon}`} style={{fontSize: fontSize}}
             onClick={onClick}>{content}</div>
    )
}

export default SideBar;