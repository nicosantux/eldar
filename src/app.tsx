import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>eldar</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}
