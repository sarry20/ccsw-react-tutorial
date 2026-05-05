import { useEffect, useState, useContext } from 'react'
import Button from '@mui/material/Button'
import TableHead from '@mui/material/TableHead'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CreateAuthor from './components/CreateAuthor'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useAppDispatch } from '../../redux/hooks'
import { setMessage } from '../../redux/features/manageSlice'
import type { BackError } from '../../types/appTypes'
import type { Author as AuthorModel } from '../../types/Author'
import {
  useDeleteAuthorMutation,
  useGetAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation
} from '../../redux/services/ludotecaApi'
import { LoaderContext } from '../../context/LoaderProvider'
import AuthorRow from './components/AuthorRow'

export default function Author () {
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [authors, setAuthors] = useState<AuthorModel[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [idToDelete, setIdToDelete] = useState('')
  const [authorToUpdate, setAuthorToUpdate] = useState<AuthorModel | null>(
    null
  )

  const dispatch = useAppDispatch()
  const loader = useContext(LoaderContext)

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageNumber(0)
    setPageSize(parseInt(event.target.value, 10))
  }

  const { data, error, isLoading } = useGetAuthorsQuery({
    pageNumber,
    pageSize
  })

  const [deleteAuthorApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteAuthorMutation()

  const [createAuthorApi, { isLoading: isLoadingCreate }] =
    useCreateAuthorMutation()

  const [updateAuthorApi, { isLoading: isLoadingUpdate }] =
    useUpdateAuthorMutation()

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    )
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate])

  useEffect(() => {
    if (data) {
      setAuthors(data.content)
      setTotal(data.totalElements)
    }
  }, [data])

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
  }, [error])

  const handleOpenEditModal = (props: {author: AuthorModel}) => {
    setAuthorToUpdate(props.author)
    setOpenCreate(true)
  }

  const handleOpenDeleteModal = (props: {idToDelete: string}) => {
    setIdToDelete(props.idToDelete)
  }

  const createAuthor = (author: AuthorModel) => {
    setOpenCreate(false)
    if (author.id) {
      updateAuthorApi(author)
        .then(() => {
          dispatch(
            setMessage({
              text: 'Autor actualizado correctamente',
              type: 'ok'
            })
          )
          setAuthorToUpdate(null)
        })
        .catch((err) => console.log(err))
    } else {
      createAuthorApi(author)
        .then(() => {
          dispatch(
            setMessage({ text: 'Autor creado correctamente', type: 'ok' })
          )
          setAuthorToUpdate(null)
        })
        .catch((err) => console.log(err))
    }
  }

  const deleteAuthor = () => {
    deleteAuthorApi(idToDelete)
      .then(() => {
        setIdToDelete('')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='container'>
      <h1>Listado de Autores</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
          <TableHead
            sx={{
              '& th': {
                backgroundColor: 'lightgrey'
              }
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre Autor</TableCell>
              <TableCell>Nacionalidad</TableCell>
              <TableCell align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((author: AuthorModel) => (
              <AuthorRow
                key={author.id}
                author={author}
                handleOpenDeleteModal={handleOpenDeleteModal}
                handleOpenEditModal={handleOpenEditModal}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={4}
                count={total}
                rowsPerPage={pageSize}
                page={pageNumber}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page'
                    },
                    native: true
                  }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <div className='newButton'>
        <Button variant='contained' onClick={() => setOpenCreate(true)}>
          Nuevo autor
        </Button>
      </div>

      <CreateAuthor
        create={createAuthor}
        author={authorToUpdate}
        handleCloseModal={() => {
          setAuthorToUpdate(null)
          setOpenCreate(false)
        }}
        openCreate={openCreate}
      />

      <ConfirmDialog
        title='Eliminar Autor'
        text='Atención si borra el autor se perderán sus datos. ¿Desea eliminar el autor?'
        confirm={deleteAuthor}
        handleCloseModal={() => setIdToDelete('')}
        idToDelete={idToDelete}
      />

    </div>
  )
}
