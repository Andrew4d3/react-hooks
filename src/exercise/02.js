// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorage = (key, initialValue = '') => {
  const [current, setCurrent] = React.useState(
    () => JSON.parse(window.localStorage.getItem(key)) || initialValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(current))
  }, [key, current, setCurrent])

  return [current, setCurrent]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
