import { useId, useState } from 'react';
import './App.css'
import Skill from './components/Skill';

const App = () => {

  // CSR, SSR, SSG

   const [count, setCount] = useState(10);
   const id = useId();

   const increaseCount = () => {
    setCount(count + 1);
   }

  return (
    <>
    
    <h2>{count}</h2>

    <button onClick={() => increaseCount()}>Click</button>

    <form action="">
      <label htmlFor={id + '-name'}>Enter your name:</label>
      <input type="text" id={id + '-name'} name="name" />

      <label htmlFor={id + '-email'}>Enter your email:</label>
      <input type="email" id={id + '-email'} name="email" />
    </form>
     
    </>

  )
}

export default App
