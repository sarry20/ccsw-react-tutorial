import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import type { Loan } from '../../../types/Loan'
import { TableCell, TableRow } from '@mui/material'
import styles from '../Loan.module.css'

interface Props {
  loan: Loan;
  handleOpenEditModal: (props: {loan: Loan}) => void;
  handleOpenDeleteModal: (props: {idToDelete: string}) => void
}

export default function LoanRow (props: Props) {
  const { loan, handleOpenEditModal, handleOpenDeleteModal } = props
  const id = loan.id
  return (
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
            onClick={() => handleOpenEditModal({ loan })}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            color='error'
            onClick={() => handleOpenDeleteModal({ idToDelete: id })}
          >
            <ClearIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  )
}
