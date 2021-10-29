import { useRouter } from "next/router"
import InfiniteScroll from 'react-infinite-scroll-component'
import React, {useState, useEffect} from 'react'
import styles from '../styles/Search.module.css'

export default function CatSearch() {
  const [data, setData] = useState([])
  const [favourites, setFavourites] = useState('')
  const router = useRouter()
  const {breed, category} = router.query;

  const getRenderData = async () => {
    let param;
    let id;
    if (breed || category) {
      param = breed ? "breed_id=" : "category_ids=";
      id = breed ?? category

    } else {
      setData([])
    }

    const res = await fetch(`https://api.thecatapi.com/v1/images/search?${param}${id}&limit=10&order=desc&page=0`);
    const resData = await res.json();

    setData(resData)

  }

  const getHeading = () => {
    if (!data.length && (breed || category)) {
      return <h4 className={styles.center}>Loading...</h4>
    }
    if (breed) {
      if (!data[0].breeds.length) {
        return (
          <h4 className={styles.center}>Loading...</h4>
        )
      }
      const breedInfo = data[0].breeds[0]
      return (
        <div>
          <h1 className={styles.title}>{breedInfo.name}</h1>
          <p className={styles.subtitle}>{breedInfo.description}</p>
        </div>
      )
    } else if (category) {
      if (!data[0].categories) {
        return <h4 className={styles.center}>Loading...</h4>
      }
      return (
        <h1 className={styles.center}>{data[0].categories[0].name}</h1>
      )
    }
    return 'Please select a breed or category'
  }

  useEffect(() => {
    getRenderData()
    setFavourites(localStorage.getItem('favourites'))
  }, [router])
  
  const handleFavourite = (url) => {
    if (!localStorage.getItem('favourites')) {
      localStorage.setItem('favourites', url)
    } else {
      localStorage.setItem('favourites', localStorage.getItem('favourites') + '&&' + url)
    }
    
    setFavourites(localStorage.getItem('favourites'))
  }

  const isFavourite = (url) => {
    if (!favourites) {
      return false
    }
    return favourites.split('&&').findIndex(f => f === url) > -1
  }

  return (
      <div>
        <div className={styles.header}>
        <button className={styles.link} onClick={() => router.push('/breeds')}>Breeds</button>
        <button className={styles.link} onClick={() => router.push('/categories')}>Categories</button>
        <button className={styles.link} onClick={() => router.push('/favourites')}>Favourites</button>
      </div>
        <div>{getHeading()}</div>

        <InfiniteScroll
          dataLength={data.length}
          next={getRenderData}
          hasMore={false}
          loader={<h3> Loading...</h3>}
          endMessage={<h6 className={styles.center}>Nothing more to show</h6>}
        >
          {data.map((r, index) => (
            <div className={styles.imageContainer} key={index}>
              <img src={r.url} className={styles.image}/>
              <button disabled={isFavourite(r.url)} className={styles.button} onClick={() => handleFavourite(r.url)}>{isFavourite(r.url) ? 'Favourited' : 'Favourite'}</button>
            </div>
          ))}
        </InfiniteScroll>


        
      </div>
  )
}

