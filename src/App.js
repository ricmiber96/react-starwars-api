import { useEffect, useState, useRef } from 'react';
import { getCharacter, getPeople, searchCharacter } from './api/people';
import './App.css';
// import data from './assets/data.json';

function App() {

  const inputSearch = useRef(null)
  const [textSearch, setTextSearch] = useState('')
  const [people, setPeople] = useState([])
  const [currentCharacter, setCurrentCharacter] = useState(1)
  const [characterDetails, setCharacterDetails] = useState([])
  const [error, setError] = useState({hasError: false})
  const [page, setPage] = useState(1)

  useEffect(() => {
    getPeople(page)
      .then((data) => setPeople(data))
      .catch(handleError)

  },[page])

  useEffect(() => {
    getCharacter(currentCharacter).then((data) => setCharacterDetails(data)).catch(handleError)
  },[currentCharacter])

  const handleError = (err) => {
    setError({hasError: true, message: err.message})
  }

  const handleOnChange = (event) => {
    event.preventDefault()
    const text = inputSearch.current.value
    setTextSearch(text)
  }

  const onSearchSubmit = (event) => {

    if(event.key !== "Enter"){return}
    inputSearch.current.value = ""
    setCharacterDetails({})
    searchCharacter(textSearch).then(data => {setPeople(data)}).catch(handleError)
  }

  const onChangePage = (nextPage) => {
    if(!people.previous && page + nextPage <= 0) return
    if(!people.next && page + nextPage >= 9) return
    setPage (page + nextPage)
  }

  const showDetails = (url) => {
    const id = Number(url.split('/').slice(-2)[0]) 
    setCurrentCharacter(id)
  }

  return (
    <main>
      <input ref={inputSearch} onChange={handleOnChange} onKeyDown={onSearchSubmit} type="text" placeholder="Busca un personaje"/>
      <ul>
        {error.hasError && <div>{error.message}</div>}
        {
        people?.results?.map((character,i)=>(
          <li key={character.name} onClick={()=>showDetails(character.url)}>{character.name}</li>
          ))
        }
      </ul>
      <div>
        <button onClick={()=> onChangePage(-1)}>PREV</button>
        {page}
        <button onClick={()=> onChangePage(1)}>NEXT</button>
      </div>
      {characterDetails && (
        <aside>
          <h1>{characterDetails.name}</h1>
          <ul>
            <li>Height: {characterDetails.height}</li>
            <li>Mass: {characterDetails.mass}</li>
            <li>Year of Birth: {characterDetails.birth_year}</li>
          </ul>
        </aside>
      )}
    </main>
  );
}

export default App;
