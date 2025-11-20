import React, { useEffect } from "react";
import { useAddUserMutation, useGetUsersQuery, useUpdateUserNameByIdMutation } from "./services/usersService";

export default function App() {
  const { data, isLoading, error, isSuccess } = useGetUsersQuery();
  const [addUser, { isLoading: isAdding, error: addError, isSuccess: isAddSuccess }] = useAddUserMutation();
  const [updateUserNameById, { isLoading: isUpdating, error: updateError, isSuccess: isUpdateSuccess }] = useUpdateUserNameByIdMutation();

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess) {
      console.log("Success", data);
    }

    if (isLoading) {
      console.log("Loading...");
    }

    if (isAddSuccess) {
    console.log("Add Success", data);
  }
  }, [data, isLoading, error, isSuccess, isAddSuccess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (addError) {
    return <div>Error: {addError.message}</div>;
  }

  return (
    <div>
      <h1>Users</h1>

      <button onClick={() => addUser({ name: "Oli", email: "oli@example.com" })}>Add User</button>
      <ul>
        {data?.map((user) => (
          <li onClick={() => updateUserNameById({ id: user.id, name: 'Oli Ullah' })} key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
