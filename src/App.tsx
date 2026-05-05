import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { LoaderProvider } from './context/LoaderProvider'
import { lazy } from 'react'

const LazyGame = lazy(() => import('./pages/game/Game.jsx'))
const LazyCategory = lazy(() => import('./pages/category/Category.jsx'))
const LazyAuthor = lazy(() => import('./pages/author/Author.jsx'))
const LazyClient = lazy(() => import('./pages/client/Client.jsx'))
const LazyLoan = lazy(() => import('./pages/loan/Loan.jsx'))

function App () {
  return (
    <LoaderProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index path='games' element={<LazyGame />} />
              <Route path='categories' element={<LazyCategory />} />
              <Route path='authors' element={<LazyAuthor />} />
              <Route path='clients' element={<LazyClient />} />
              <Route path='loans' element={<LazyLoan />} />
              <Route path='*' element={<Navigate to='/games' />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </LoaderProvider>
  )
}

export default App
