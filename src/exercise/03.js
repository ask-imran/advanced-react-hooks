// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

const CountContext = React.createContext();

function useCount(){
  const contextValue = React.useContext(CountContext);
  if(!contextValue){
    throw Error("useCount must be used within a count provider");
  }
  return contextValue;
  
}
function CountDisplay() {
  const [count] = useCount();
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const [, setCount] = useCount();
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
    <CountContext.Provider value={[count, setCount]}>
      <Counter />
      <CountDisplay />
    </CountContext.Provider>
    </div>
  )
}

export default App
