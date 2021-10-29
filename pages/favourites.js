import styles from '../styles/Favourites.module.css';

import { useRouter } from "next/router"

export default function Favourites() {
    const router = useRouter()

    if (typeof window === "undefined") {
        return ('')
    }

    console.log('Favourites', localStorage.getItem('favourites'))

    const favourites = localStorage.getItem('favourites').split('&&')
    console.log(favourites)
    
    return (
        <div>
          <div className={styles.header}>
            <button className={styles.link} onClick={() => router.push('/breeds')}>Breeds</button>
            <button className={styles.link} onClick={() => router.push('/categories')}>Categories</button>
            <button className={styles.active}>Favourites</button>
          </div>
            <h1 className={styles.title}>Favourites</h1>
            {favourites.map((r, index) => (
            <div className={styles.imageContainer} key={index}>
              <img src={r} className={styles.image}/>
            </div>
          ))}
        </div>
    )
}