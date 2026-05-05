import { TableCell, TableRow } from '@mui/material'
import type { Client } from '../../../types/Client'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import styles from '../Client.module.css'
interface Props {
  client: Client;
  handleOpenEditModal: (props: {client: Client}) => void;
  handleOpenDeleteModal: (props: {idToDelete: string}) => void
}

export default function ClientRow (props: Props) {
  const { client, handleOpenEditModal, handleOpenDeleteModal } = props
  const id = client.id
  return (
    <TableRow
      key={client.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component='th' scope='row'>
        {client.id}
      </TableCell>
      <TableCell component='th' scope='row'>
        {client.name}
      </TableCell>
      <TableCell>
        <div className={styles.tableActions}>
          <IconButton
            aria-label='update'
            color='primary'
            onClick={() => handleOpenEditModal({ client })}
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
