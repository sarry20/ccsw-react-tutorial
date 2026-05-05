import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import type { Category as CategoryModel } from '../../types/Category'
import { useState, useEffect, useContext } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useAppDispatch } from '../../redux/hooks'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation
} from '../../redux/services/ludotecaApi'

import { setMessage } from '../../redux/features/manageSlice'
import { LoaderContext } from '../../context/LoaderProvider'
import type { BackError } from '../../types/appTypes'
import CreateCategory from './components/CreateCategory'
import CategoryRow from './components/CategoryRow'

export default function Category () {
  const [openCreate, setOpenCreate] = useState(false)
  const [categoryToUpdate, setCategoryToUpdate] =
    useState<CategoryModel | null>(null)
  const [idToDelete, setIdToDelete] = useState('')

  const dispatch = useAppDispatch()
  const { data, error, isLoading } = useGetCategoriesQuery(null)

  const [
    deleteCategoryApi,
    { isLoading: isLoadingDelete, error: errorDelete }
  ] = useDeleteCategoryMutation()

  const [createCategoryApi, { isLoading: isLoadingCreate }] =
    useCreateCategoryMutation()

  const [updateCategoryApi, { isLoading: isLoadingUpdate }] =
    useUpdateCategoryMutation()

  const loader = useContext(LoaderContext)

  useEffect(() => {
    if (errorDelete) {
      if ('status' in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: 'error'
          })
        )
      }
    }
  }, [errorDelete, dispatch])

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: 'Se ha producido un error', type: 'error' }))
    }
  }, [dispatch, error])

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    )
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate, loader])

  const handleCloseCreate = () => {
    setOpenCreate(false)
    setCategoryToUpdate(null)
  }

  const handleOpenEditModal = (props: {category: CategoryModel}) => {
    setCategoryToUpdate(props.category)
    setOpenCreate(true)
  }

  const handleOpenDeleteModal = (props: {idToDelete: string}) => {
    setIdToDelete(props.idToDelete)
  }

  const createCategory = (category: string) => {
    setOpenCreate(false)
    if (categoryToUpdate) {
      updateCategoryApi({ id: categoryToUpdate.id, name: category })
        .then(() => {
          dispatch(
            setMessage({
              text: 'Categoría actualizada correctamente',
              type: 'ok'
            })
          )
          setCategoryToUpdate(null)
        })
        .catch((err) => console.log(err))
    } else {
      createCategoryApi({ name: category })
        .then(() => {
          dispatch(
            setMessage({ text: 'Categoría creada correctamente', type: 'ok' })
          )
          setCategoryToUpdate(null)
        })
        .catch((err) => console.log(err))
    }
  }
  const deleteCategory = () => {
    deleteCategoryApi(idToDelete)
      .then(() => {
        dispatch(
          setMessage({
            text: 'Categoría borrada correctamente',
            type: 'ok'
          })
        )
        setIdToDelete('')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='container'>
      <h1>Listado de Categorías</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead
            sx={{
              '& th': {
                backgroundColor: 'lightgrey'
              }
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre categoría</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((category: CategoryModel) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  handleOpenDeleteModal={handleOpenDeleteModal}
                  handleOpenEditModal={handleOpenEditModal}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='newButton'>
        <Button variant='contained' onClick={() => setOpenCreate(true)}>
          Nueva categoría
        </Button>
      </div>

      <CreateCategory
        create={createCategory}
        category={categoryToUpdate}
        handleCloseModal={handleCloseCreate}
        openCreate={openCreate}
      />

      <ConfirmDialog
        title='Eliminar categoría'
        text='Atención si borra la categoría se perderán sus datos. ¿Desea eliminar la categoría?'
        confirm={deleteCategory}
        handleCloseModal={() => setIdToDelete('')}
        idToDelete={idToDelete}
      />

    </div>
  )
}
