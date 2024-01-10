// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {error: null}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {error}
  }

  render() {
    console.log('Error Boundary', this.state.error)

    if (this.state.error) {
      return <this.props.FallbackMessage error={this.state.error} />
    }

    return this.props.children
  }
}

function FallbackMessage({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  // const [status, setStatus] = React.useState(STATUS.idle)

  const initialState = {
    pokemon: null,
    error: null,
    status: STATUS.idle,
  }

  const [state, setState] = React.useState(initialState)
  const {pokemon, error, status} = state

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    const fetchFn = async () => {
      try {
        const pokemonData = await fetchPokemon(pokemonName)

        setState({
          pokemon: pokemonData,
          status: STATUS.resolved,
        })
      } catch (error) {
        setState({
          status: STATUS.rejected,
          error,
        })
      }
    }
    setState({
      status: STATUS.pending,
    })
    fetchFn()
  }, [pokemonName])
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  if (status === STATUS.idle) {
    return 'Submit a pokemon'
  }

  if (status === STATUS.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === STATUS.rejected) {
    throw error
  }

  // if status is resolved

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackMessage={FallbackMessage}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

// TODO do lesson 70 excersise
