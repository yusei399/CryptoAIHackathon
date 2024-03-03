import styles from "./page.module.css";
import SideBar from "@/component/SideBar/SideBar";

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.circleContainer}>
                <span className={styles.outerCircle} style={{scale: 2.3}}/>
                <span className={styles.outerCircle} style={{scale: 1.05}}/>
                <div className={`${styles.outerCircle} ${styles.micButton}`}>
                    <div className={styles.micButtonTitle}>環境音の分析を開始</div>
                </div>
            </div>
            <SideBar/>
        </main>
    );
}
