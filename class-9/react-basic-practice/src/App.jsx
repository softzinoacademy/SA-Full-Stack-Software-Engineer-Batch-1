import { useEffect, useState } from 'react'
import './App.css'
import Student from './components/Student'

function App() {

  const [result, setResult] = useState('A+');
//   const [count, setCount] = useState(0)
//   const [count2, setCount2] = useState(0)

//  useEffect(() => {
//   // console.log('useEffect always run')

//   return () => {
//     // console.log('useEffect cleanup')
//   }
//  }, [])

//  useEffect(() => {
//   // console.log('useEffect run only once')
//  }, [count, count2])



  return (
    <>
      {/* <h1>Hello React</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      {count == 0 && <Student/>} */}
      <Student result={result}/>
    </>
  )
}

export default App
