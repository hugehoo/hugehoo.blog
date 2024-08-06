import styles from "@/app/blog/TeamPage.module.css";
import FlipCard from "@/components/ui/FlipCard";


const MainIntro = () => {
  const strings = ['Lim Sunghoo', 'Work Experiences', 'Projects'];
  return (
    <section className={styles.teamSection}>
      <div className={styles.underlineTitle}>
        <p>About</p>
      </div>
      <div className={styles.teamGrid}>
        {strings.map((name, index) => (
          <div key={name} className={styles.teamMember}>
            <div className={styles.underlineTitle}>
              <h3>{name}</h3>
            </div>
            <FlipCard
              frontImage={`/team-member-${index + 1}.jpeg`}
              altText={name}
              backContent={
                <div>
                  <h4>{name}</h4>
                  <p>{name}</p>
                </div>
              }
              width={400}
              height={600}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default MainIntro;
