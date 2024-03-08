import React, {useEffect, useState} from "react";
import axios from "axios";
import styles from "@/component/Recoding/Recoding.module.css";
import {IconButton} from "@/component/SideBar/SideBar";

type Props = {
    isIcon: boolean,
}

const Recoding = ({isIcon}: Props) => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
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
            }, 5000); // 5秒後に録音を停止

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    // FormDataを作成し、Blobデータを追加
                    const formData = new FormData();
                    formData.append('file', e.data);

                    const url = 'http://ec2-35-76-128-253.ap-northeast-1.compute.amazonaws.com/api/v1/recommendation';
                    axios.post(url, formData)
                        .then((response) => {
                            console.log('Response:', response.data);
                        })
                        .catch((error) => {
                            if (error.response) {
                                // サーバーからの応答がある場合
                                console.error('Error Response Data:', error.response.data);
                                console.error('Error Response Status:', error.response.status);
                                console.error('Error Response Headers:', error.response.headers);
                            } else if (error.request) {
                                // リクエストは送られたが応答を受け取らなかった場合
                                console.error('Error Request:', error.request);
                            } else {
                                // 何らかの理由でリクエスト自体が失敗した場合
                                console.error('Error Message:', error.message);
                            }
                            console.error('Error Config:', error.config);
                        });
                }
            };
        }
    };

    if (isIcon) {
        if (isRecording) {
            return (
                <div className={`${styles.icon}`} style={{fontSize: 28}}>
                    {countdown}
                </div>
            );
        } else {
            return <IconButton content={"mic_none"} fontSize={40} onClick={startRecording}/>
        }
    } else {
        if (isRecording) {
            return (
                <div className={`${styles.outerCircle} ${styles.micButton}`}>
                    <div style={{fontSize: 72, width: "100%"}}>{countdown}</div>
                </div>
            );
        } else {
            return (
                <div className={`${styles.outerCircle} ${styles.micButton}`} onClick={startRecording}>
                    <div className={styles.micButtonTitle}>環境音の分析を開始</div>
                </div>
            )
        }
    }
}

export default Recoding;