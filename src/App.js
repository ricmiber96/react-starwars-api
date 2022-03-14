import { useEffect, useState } from 'react';
import { getCharacter, getPeople } from './api/people';
import './App.css';
// import data from './assets/data.json';

function App() {

  const [people, setPeople] = useState([])
  const [currentCharacter, setCurrentCharacter] = useState(1)
  const [characterDetails, setCharacterDetails] = useState([])
  const [error, setError] = useState({hasError: false})

  useEffect(() => {
    getPeople().then((data) => setPeople(data.results)).catch(handleError)
  },[])

  useEffect(() => {
    getCharacter(currentCharacter).then((data) => setCharacterDetails(data)).catch(handleError)
  },[currentCharacter])

  const handleError = (err) => {
    setError({hasError: true, message: err.message})
  }

  const showDetails = (url) => {
    const id = Number(url.split('/').slice(-2)[0]) 
    setCurrentCharacter(id)
  }

  return (
    <main>
      <ul>
        {error.hasError && <div>{error.message}</div>}
        {
        people.map((character,i)=>(
          <li key={character.name} onClick={()=>showDetails(character.url)}>{character.name}</li>
          ))
        }
      </ul>
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
