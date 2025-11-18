import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import { addAddress } from '../counterSlice';

function App() {
 const { addresses } = useSelector((state) => state.addressReducer);

 const dispatch = useDispatch();

  return (
    <>
      <h1>Hello Redux Toolkit</h1>
      {addresses.map((address) => (
        <div key={address.id}>
          <p>{address.street}</p>
          <p>{address.city}</p>
          <p>{address.postalCode}</p>
        </div>
      ))}

          <button
          onClick={() =>
            dispatch(
              addAddress({
                id: 2,
                street: "456 Elm St",
                city: "Othertown",
                state: "CA",
                zip: "67890",
              })
            )
          }
        >
          Add Address
        </button>
    </>
  )
}

export default App
