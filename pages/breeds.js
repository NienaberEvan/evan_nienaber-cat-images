import styles from '../styles/Breeds.module.css'
import { useRouter } from "next/router"

export default function Breeds({ data }) {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.active}>Breeds</button>
        <button className={styles.link} onClick={() => router.push('/categories')}>Categories</button>
        <button className={styles.link} onClick={() => router.push('/favourites')}>Favourites</button>
      </div>
      <div className={styles.buttonContainer}>
        {data.map(d => (
        <button 
          key={d.name} 
          onClick={() => router.push(`/cat-search/?breed=${d.id}`)}
          className={styles.button}
        >
          {d.name}
        </button>))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
    const res = await fetch('https://api.thecatapi.com/v1/breeds');
    const data = await res.json();
    
    if (!data) {
      return {
        notFound: true
      }
    }
    return {
      props: {data}
    }
}
