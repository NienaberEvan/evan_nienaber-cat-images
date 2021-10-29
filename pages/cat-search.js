import { useRouter } from "next/router"
import InfiniteScroll from 'react-infinite-scroll-component'
import React, {useState, useEffect} from 'react'
import styles from '../styles/Search.module.css'

export default function CatSearch() {
  const [data, setData] = useState([])
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

    console.log({resData})

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
      console.log({breedInfo})
      return (
        <div>
          <h1 className={styles.title}>{breedInfo.name}</h1>
          <p className={styles.subtitle}>{breedInfo.description}</p>
        </div>
      )
      // return 'Breed'
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
  }, [router])
  

  return (
      <div>
        <div className={styles.header}>
        <button className={styles.link} onClick={() => router.push('/breeds')}>Breeds</button>
        <button className={styles.link} onClick={() => router.push('/categories')}>Categories</button>
        <button className={styles.link} onClick={() => router.push('/favourites')}>Favourites</button>
      </div>
        <h1>{getHeading()}</h1>

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
              <button className={styles.button}>Favourite</button>
            </div>
          ))}
        </InfiniteScroll>


        
      </div>
  )
}

