import { useRouter } from "next/router"

const Search = () => {

    const router = useRouter()
    const {id} = router.query;

    return <h1>Search {id}</h1>
}

export default Search