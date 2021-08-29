// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function countReducer(currentState, action) {
  switch (action.type) {
    case 'INCREMENT': {
      return {...currentState, count: currentState.count + action.step}
    }
    default:
      return 0
  }
}
function Counter({initialCount = 8, step = 1}) {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })

  const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
