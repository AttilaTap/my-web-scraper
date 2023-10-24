import Link from 'next/link';
import React from 'react';
import ButtonComponent from './components/utils/button-service';
import styles from './page.module.css'; // Assuming this is the correct path

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Link href="/dashboard"> 
        <button className={styles.backButton}>←</button> 
      </Link>
      <h1 className={styles.dashboardHeading}>Welcome to the Dashboard</h1>
      <div className={styles.dashboardButtonsContainer}>
        <ButtonComponent className={styles.dashboardButton} route="/bookScraper" name="BookScraper" />
        <ButtonComponent className={styles.dashboardButton} route="/9gagScraper" name="9gagScraper" />
        <ButtonComponent className={styles.dashboardButton} route="/9gagScraperV2" name="9gagScraperV2" />
        <ButtonComponent className={styles.dashboardButton} route="/page4" name="Page 4" />
      </div>
    </div>
  );
};

export default Dashboard;
