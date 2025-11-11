import React, { useContext, useEffect } from 'react'
import Result from './Result'
import StudentContext from '../contexts/StudentContext'

export default function Student() {
    const context = useContext(StudentContext)
    useEffect(() => {
        console.log('student useEffect always run')
        return () => {
            console.log('stuent useEffect cleanup')
        }
    })
  return (
    <div>
        Student
        result in student context: {context.result}

        <Result />
    </div>
  )
}
