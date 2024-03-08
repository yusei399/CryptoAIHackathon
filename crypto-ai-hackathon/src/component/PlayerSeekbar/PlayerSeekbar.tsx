"use client"
import styles from "./PlayerSeekbar.module.css";
import React, {useState, useEffect} from 'react';

type Props = {
    seekState: PlayerSeekState | null,
}

export type PlayerSeekState = {
    position: number;
    duration: number;
    paused: boolean;
    timestamp: number;
};

const PlayerSeekbar = ({seekState}: Props) => {
    const [width, setWidth] = useState<number>(0);
    const [duration, setDuration] = useState<string>("");

    useEffect(() => {
        const updatePosition = () => {
            if (!seekState) {
                return;
            }
            const newPosition = seekState.position + (seekState.paused ? 0 : Date.now() - seekState.timestamp);
            const newWidth = (newPosition / seekState.duration) * 100;
            setWidth(newWidth);

            const calcDurationString = (duration: number): string => {
                const totalSec = duration / 1000;
                const minute = Math.floor(totalSec / 60);
                const second = Math.floor(totalSec % 60);
                return `${minute}:${second.toString().padStart(2, '0')}`
            }

            setDuration(`${calcDurationString(newPosition)} / ${calcDurationString(seekState.duration)}`);

            window.requestAnimationFrame(updatePosition);
        };
        window.requestAnimationFrame(updatePosition);
    }, [seekState]);

    return (
        <div className={styles.container}>
            <div className={styles.playbackTime}>{duration}</div>
            <div className={styles.seekbar} style={{width: `${width}%`}}/>
        </div>
    );
};

export default PlayerSeekbar;