import { configureStore } from '@reduxjs/toolkit'
import { ludotecaAPI } from './services/ludotecaApi'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import messageReducer from './features/manageSlice'

export const store = configureStore({
  reducer: {
    messageReducer,
    [ludotecaAPI.reducerPath]: ludotecaAPI.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([ludotecaAPI.middleware])
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
