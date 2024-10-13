import React from 'react';
import JobPost from './JobPost';
import styles from './style.module.css';

const JobPostPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.subtitle}>
          Explore the latest job opportunities tailored just for you.
        </p>
      </header>
      <main className={styles.jobPostContainer}>
        <JobPost />
      </main>
    </div>
  );
};

export default JobPostPage;