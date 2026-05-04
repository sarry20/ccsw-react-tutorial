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
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import styles from './Loan.module.css'
import CreateLoan from './components/CreateLoan'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useAppDispatch } from '../../redux/hooks'
import { setMessage } from '../../redux/features/manageSlice'
import type { BackError } from '../../types/appTypes'
import type { Loan as LoanModel } from '../../types/Loan'
import {
  useDeleteLoanMutation,
  useGetLoansQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useGetClientsQuery,
  useGetGamesQuery
} from '../../redux/services/ludotecaApi'
import { LoaderContext } from '../../context/LoaderProvider'
import { AlertDialog } from '../../components/AlertDialog'
import { FormControl, TextField, MenuItem } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export const Loan = () => {
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [titleFilter, setTitleFilter] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null)

  const [total, setTotal] = useState(0)
  const [loans, setLoans] = useState<LoanModel[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [idToDelete, setIdToDelete] = useState('')
  const [loanToUpdate, setLoanToUpdate] = useState<LoanModel | null>(null)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState(
    'Se ha producido un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.'
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

  const { data, error, isLoading } = useGetLoansQuery({
    pageNumber,
    pageSize,
    title: titleFilter,
    client: clientFilter,
    date: dateFilter ? dateFilter.toDate().toISOString() : undefined
  })

  const { data: clients } = useGetClientsQuery(null)

  const { data: games } = useGetGamesQuery({
    title: '',
    idCategory: ''
  })

  const [deleteLoanApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteLoanMutation()

  const [createLoanApi, { isLoading: isLoadingCreate }] =
    useCreateLoanMutation()

  const [updateLoanApi, { isLoading: isLoadingUpdate }] =
    useUpdateLoanMutation()

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    )
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate])

  useEffect(() => {
    if (data) {
      setLoans(data.content)
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

  const createLoan = (loan: LoanModel) => {
    setOpenCreate(false)
    if (loan.id) {
      updateLoanApi(loan)
        .then((res) => {
          setLoanToUpdate(null)
          if (res.error?.status === 400) {
            setText(res.error.data.message)
            setOpen(true)
            return
          }
          dispatch(
            setMessage({
              text: 'Préstamo actualizado correctamente',
              type: 'ok'
            })
          )
        })
        .catch((err) => console.log(err))
    } else {
      createLoanApi(loan)
        .then((res) => {
          setLoanToUpdate(null)
          if (res.error?.status === 400) {
            setText(res.error.data.message)
            setOpen(true)
            return
          }
          dispatch(
            setMessage({ text: 'Préstamo creado correctamente', type: 'ok' })
          )
        })
        .catch((err) => console.log(err))
    }
  }

  const deleteLoan = () => {
    deleteLoanApi(idToDelete)
      .then(() => {
        setIdToDelete('')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='container'>
      <h1>Listado de Préstamos</h1>
      <div className={styles.filter}>
        <FormControl variant='standard' sx={{ m: 1, minWidth: 220 }}>
          <TextField
            margin='dense'
            id='game'
            select
            label='Titulo del juego'
            defaultValue="''"
            fullWidth
            value={titleFilter}
            name='game'
            variant='standard'
            onChange={(event) => setTitleFilter(event.target.value)}
          >
            {games &&
              games.map((option) => (
                <MenuItem key={option.id} value={option.title}>
                  {option.title}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <FormControl variant='standard' sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id='client'
            select
            label='Cliente'
            defaultValue="''"
            fullWidth
            variant='standard'
            name='client'
            value={clientFilter}
            onChange={(event) => setClientFilter(event.target.value)}
          >
            {clients &&
              clients.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <FormControl variant='standard' sx={{ m: 1, minWidth: 220 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha de solicitud'
              value={dateFilter || null}
              format='DD/MM/YYYY'
              onChange={(value) => setDateFilter(value || null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'dense',
                  variant: 'standard'
                }
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <Button
          variant='outlined'
          onClick={() => {
            setClientFilter('')
            setTitleFilter('')
          }}
        >
          Limpiar
        </Button>
      </div>
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
              <TableCell>Nombre del Juego</TableCell>
              <TableCell>Nombre del Cliente</TableCell>
              <TableCell>Fecha de Solicitud</TableCell>
              <TableCell>Fecha de Devolución</TableCell>
              <TableCell align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan: LoanModel) => (
              <TableRow key={loan.id}>
                <TableCell component='th' scope='row'>
                  {loan.id}
                </TableCell>
                <TableCell style={{ width: 160 }}>{loan.game.title}</TableCell>
                <TableCell style={{ width: 160 }}>{loan.client.name}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {new Date(loan.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {new Date(loan.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell align='right'>
                  <div className={styles.tableActions}>
                    <IconButton
                      aria-label='update'
                      color='primary'
                      onClick={() => {
                        setLoanToUpdate(loan)
                        setOpenCreate(true)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      color='error'
                      onClick={() => {
                        setIdToDelete(loan.id)
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
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
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page'
                  },
                  native: true
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
          Nuevo préstamo
        </Button>
      </div>
      {openCreate && (
        <CreateLoan
          create={createLoan}
          loan={loanToUpdate}
          handleCloseModal={() => {
            setLoanToUpdate(null)
            setOpenCreate(false)
          }}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title='Eliminar Préstamo'
          text='Atención si borra el préstamo se perderán sus datos. ¿Desea eliminar el préstamo?'
          confirm={deleteLoan}
          handleCloseModal={() => setIdToDelete('')}
        />
      )}
      {!!open && (
        <AlertDialog
          title='Ha ocurrido un error'
          text={text}
          handleCloseModal={() => setOpen(false)}
        />
      )}
    </div>
  )
}
