
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `users`,
      providesTags: ['Users'],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: `users`,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUserNameById: builder.mutation({
      query: ({ id, name }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})


export const { useGetUsersQuery, useAddUserMutation, useUpdateUserNameByIdMutation } = usersApi
