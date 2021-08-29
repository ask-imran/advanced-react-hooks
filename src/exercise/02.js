// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useSafeDispatch(dispatch){
  const isMounted = React.useRef(false);
  
  React.useEffect(()=>{
    isMounted.current = true;
    return () => isMounted.current = false;
  }, []);
  
  return React.useCallback((...args) => {
    if(isMounted.current) {
      dispatch(...args)
    }
  },[dispatch])
}

function useAsync({status}) { 

  const [state, unSafeDispatch] = React.useReducer(asyncReducer, {
    status,
    data: null,
    error: null,
  });

  const dispatch = useSafeDispatch(unSafeDispatch);


  const run = React.useCallback((promise) => {
    if (!promise) {
      return
    }    
    dispatch({type: 'pending'})
    promise.then((data) => {
        dispatch({type: 'resolved', data})      
    }).catch(error => {
      console.log('catch block');
      dispatch({type: 'rejected', error})
    })
  },[dispatch])
  return {...state, run};
}

function PokemonInfo({pokemonName}) {
  const {status, error, run, data} = useAsync({status: pokemonName ? 'pending' : 'idle'});
  React.useEffect(() => {
    if(!pokemonName){
      return
    }
    run(fetchPokemon(pokemonName))
  },[pokemonName, run])

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
