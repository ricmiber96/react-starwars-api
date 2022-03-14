import { render, screen } from '@testing-library/react';
import App from './App';
import data from './assets/data.json'


describe('Star Wars Api Tests',()=>{

  beforeAll(()=>{jest.spyOn(window,'fetch')})

  // it('Should render a list of characters',()=>{
  //   render(<App/>)
  //   expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
  // })

  // it('Should show a list of characters from JSON file',()=>{
  //   render(<App/>)
  //   for(let character of data.results){
  //     expect(screen.getByText(character.name)).toBeInTheDocument()
  //   }
  // })

  it('Should show a list of characters from API request',async ()=>{
    window.fetch.mockResolvedValueOnce({
      ok:true,
      json: async () => data,
    })
    render(<App/>)
    expect(window.fetch).toHaveBeenCalledTimes(1)
    expect(window.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/')

    for(let character of data.results){
      expect(await screen.findByText(character.name)).toBeInTheDocument()
    }
  })

  it('Show an error message when has a network error',async()=>{
      window.fetch.mockResolvedValueOnce(new Error('Network Error'))
      render(<App />)
      expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
