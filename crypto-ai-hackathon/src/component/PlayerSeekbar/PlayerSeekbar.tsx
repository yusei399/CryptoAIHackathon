"use client"
import styles from "./PlayerSeekbar.module.css";
import React, {useState, useEffect} from 'react';

type PlayerState = {
    position: number;
    duration: number;
    paused: boolean;
    timestamp: number;
};

const PlayerSeekbar = () => {
    const [lastState, setLastState] = useState<PlayerState | null>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const updatePosition = () => {
            if (!lastState) {
                return;
            }

            const newPosition = lastState.position + (lastState.paused ? 0 : Date.now() - lastState.timestamp);
            const newWidth = (newPosition / lastState.duration) * 100;
            setWidth(newWidth);
            requestAnimationFrame(updatePosition);
        };

        const playerStateChanged = (state: PlayerState) => {
            setLastState(state);
        };

        // player.addListener('player_state_changed', playerStateChanged);
        requestAnimationFrame(updatePosition);

        return () => {
            // player.removeListener('player_state_changed', playerStateChanged);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.playbackTime}>2:51 / 3:10</div>
            <div className={styles.seekbar} style={{width: "90%"}}/>
        </div>
    );
};

export default PlayerSeekbar;