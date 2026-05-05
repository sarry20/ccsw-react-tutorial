import { type ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  useGetClientsQuery,
  useGetGamesQuery
} from '../../../redux/services/ludotecaApi'
import type Loan from '../../../types/Loan'
import MenuItem from '@mui/material/MenuItem'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  loan: Loan | null;
  handleCloseModal: () => void;
  create: (loan: Loan) => void;
  openCreate: boolean;
}

interface LoanFormState {
  id: string;
  client?: Loan['client'];
  game?: Loan['game'];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const initialState: LoanFormState = {
  id: '',
  client: undefined,
  game: undefined,
  startDate: null,
  endDate: null
}

const mapLoanToForm = (loan: Loan | null): LoanFormState => {
  if (!loan) return initialState

  return {
    id: loan.id,
    client: loan.client,
    game: loan.game,
    startDate: loan.startDate ? dayjs(loan.startDate) : null,
    endDate: loan.endDate ? dayjs(loan.endDate) : null
  }
}

export default function CreateLoan (props: Props) {
  if (!props.openCreate) return null

  const [form, setForm] = useState<LoanFormState>(() =>
    mapLoanToForm(props.loan)
  )

  const { data: clients } = useGetClientsQuery(null)

  const { data: games } = useGetGamesQuery({
    title: '',
    idCategory: ''
  })

  const handleChangeSelect = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const values = event.target.name === 'name' ? clients : games
    setForm({
      ...form,
      [event.target.name]: values?.find((val) => val.id === event.target.value)
    })
  }

  const handleDateChange = (
    field: 'startDate' | 'endDate',
    value: Dayjs | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div>
      <Dialog open onClose={props.handleCloseModal}>
        <DialogTitle>
          {props.loan ? 'Actualizar Préstamo' : 'Crear Préstamo'}
        </DialogTitle>
        <DialogContent>
          {props.loan && (
            <TextField
              margin='dense'
              disabled
              id='id'
              label='Id'
              fullWidth
              value={props.loan.id}
              variant='standard'
            />
          )}
          <TextField
            margin='dense'
            select
            id='client'
            label='Nombre del cliente'
            fullWidth
            variant='standard'
            name='client'
            onChange={handleChangeSelect}
            value={form.client?.id || ''}
          >
            {clients &&
              clients.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin='dense'
            select
            id='game'
            label='Título del juego'
            fullWidth
            variant='standard'
            name='game'
            onChange={handleChangeSelect}
            value={form.game?.id || ''}
          >
            {games &&
              games.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha de solicitud'
              value={form.startDate}
              format='DD/MM/YYYY'
              onChange={(value) => handleDateChange('startDate', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'dense',
                  variant: 'standard'
                }
              }}
            />
            <DatePicker
              label='Fecha de devolución'
              value={form.endDate}
              format='DD/MM/YYYY'
              onChange={(value) => handleDateChange('endDate', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'dense',
                  variant: 'standard'
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseModal}>Cancelar</Button>
          <Button
            onClick={() =>
              props.create({
                id: props.loan ? props.loan.id : '',
                client: form.client,
                game: form.game,
                startDate: form.startDate!.toDate(),
                endDate: form.endDate!.toDate()
              })}
            disabled={
              !form.client || !form.game || !form.startDate || !form.endDate
            }
          >
            {props.loan ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
