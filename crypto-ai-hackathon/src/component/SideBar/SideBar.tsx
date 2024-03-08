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
    const [isRecording, setIsRecording] = useState<boolean>(false); 
    const [countdown, setCountdown] = useState<number | null>(null); 

    useEffect(() => {
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
            setIsRecording(true); 
            setCountdown(5); 

            const countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown && prevCountdown > 1) {
                        return prevCountdown - 1;
                    } else {
                        clearInterval(countdownInterval); // Clear the interval when countdown ends
                        setIsRecording(false); // Reset recording state
                        return null;
                    }
                });
            }, 1000);

            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    setIsRecording(false); // Reset recording state
                }
            }, 5000); // Stop recording after 5 seconds

            mediaRecorder.ondataavailable = (e) => {
                const audioUrl = URL.createObjectURL(e.data);
                setAudioUrl(audioUrl); // For reviewing the recording
            };
        }
    };

    return (
        <div className={styles.container}>
            {isRecording ? (
                <div className={`${styles.icon} ${styles.countdown}`} style={{fontSize: 40}}>
                    {countdown}
                </div>
            ) : (
                <IconButton content={"mic_none"} fontSize={40} onClick={startRecording}/>
            )}
            <div className={styles.bar}/>
            <IconButton content={"skip_previous"} fontSize={36} onClick={() => player?.previousTrack()}/>
            <IconButton content={isPaused ? "play_circle_filled" : "pause_circle_filled"} fontSize={48}
                        onClick={async () => {
                            setPaused(!isPaused);
                            if (isPaused) {
                                player?.resume();
                            } else {
                                player?.pause();
                            }
                        }}/>
            <IconButton content={"skip_next"} fontSize={36} onClick={() => player?.nextTrack()}/>
            {/* {audioUrl && <audio src={audioUrl} controls />}確認用 */}
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