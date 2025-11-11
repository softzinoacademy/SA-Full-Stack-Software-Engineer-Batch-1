import React from 'react'

import { useContext } from 'react'
import StudentContext from '../contexts/StudentContext.jsx'

export default function Result() {
    const context = useContext(StudentContext)

    
  return (
    <div>Student Result: {context.result} </div>
  )
}
