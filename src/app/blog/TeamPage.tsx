import Head from 'next/head'
import Image from 'next/image'
import styles from './TeamPage.module.css'
import FlipCard from "@/components/ui/FlipCard";

export const TeamPage = () => {
  const strings = ['Lim Sunghoo', 'Work Experiences'
    , 'Projects'
  ];
  const posts = [
    {name: 'Post1', role: 'CEO BALENCIAGA'},
    {name: 'Post2', role: 'CEO REBORN & YELLOW OCTOPUS'},
    {name: 'Post3', role: 'FOUNDER THE MILLS'}
  ];
  return (
    <div className={styles.container}>
      <Head>
        <title>Tech Blog Team Page</title>
        <meta name="description" content="Our team building a world of positive consumption"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Developer Hoo
          </h1>
          <a href="#" className={styles.ctaButton}>
            Join the Movement
          </a>
        </div>

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

              // <div key={name} className={styles.teamMember}>
              //   <div className={styles.underlineTitle}>
              //     <h3>{name}</h3>
              //   </div>
              //   <Image src={`/team-member-${index + 1}.jpeg`}
              //          alt={name}
              //          width={200}
              //          height={300}
              //   />
              // </div>
            ))}
          </div>
        </section>

        <section className={styles.teamSection}>
          <div className={styles.underlineTitle}>
            <p>Posts</p>
          </div>
          <div className={styles.teamGrid}>
            {posts.map((member, index) => (
              <div key={member.name}
                   className={styles.teamMember}
              >
                <div className={styles.underlineTitle}>
                  <h3>{member.name}</h3>
                </div>
                <FlipCard
                  frontImage={`/team-member-${index + 1}.jpeg`}
                  altText={member.name}
                  backContent={
                    <div>
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  }
                  width={400}
                  height={600}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
