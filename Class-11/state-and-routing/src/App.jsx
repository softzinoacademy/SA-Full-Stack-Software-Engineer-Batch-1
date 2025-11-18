import React from 'react'
import { useTodoStore } from './stores/todoStore'
import { NavLink, Outlet } from 'react-router'

export default function App() {

  return (
    <div>

      <div className='mt-10'></div>

        <NavLink to="/" end>
        Home
      </NavLink>

      <NavLink to="/about" end>
        About
      </NavLink>

      <NavLink to="/posts" end>
        Posts
      </NavLink>

      <main>
        <Outlet/>
      </main>
    </div>
  )
}
