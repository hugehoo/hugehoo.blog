import styles from '@/app/blog/TeamPage.module.css';

export const Bottom = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.bottom} flex gap-2`}>
        <a href="https://www.instagram.com/huge.hoo/">
          <p className="text-gray-500 hover:text-gray-800 transition-colors duration-300">
            @huge.hoo
          </p>
        </a>
        <a href="https://blog-scrapper-ui.vercel.app/">
          <p className="text-gray-500 hover:text-gray-600 transition-colors duration-300">
            @blog-scrapper
          </p>
        </a>
      </div>
    </footer>
  );
};
