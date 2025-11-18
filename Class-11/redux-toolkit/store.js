import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './counterSlice'

export const store = configureStore({
  reducer: {
    addressReducer: counterSlice.reducer,
  },
})

// setupListeners(store.dispatch)