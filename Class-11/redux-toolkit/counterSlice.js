import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  addresses: [
    {
      id: 1,
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
  ],
}

export const counterSlice = createSlice({
  name: 'addressSlice',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses.push(action.payload)
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter((address) => address.id !== action.payload)
    },
  },
})

export const { addAddress, removeAddress } = counterSlice.actions

export default counterSlice.reducer
