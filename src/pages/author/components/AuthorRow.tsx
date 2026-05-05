import type { Author } from '../../../types/Author'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import styles from '../Author.module.css'
import { TableCell, TableRow } from '@mui/material'

interface Props {
  author: Author,
  handleOpenEditModal: (props: {author: Author}) => void;
  handleOpenDeleteModal: (props: {idToDelete: string}) => void
}

export default function AuthorRow (props: Props) {
  const { author, handleOpenDeleteModal, handleOpenEditModal } = props
  const id = author.id
  return (
    <TableRow key={author.id}>
      <TableCell component='th' scope='row'>
        {author.id}
      </TableCell>
      <TableCell style={{ width: 160 }}>{author.name}</TableCell>
      <TableCell style={{ width: 160 }}>
        {author.nationality}
      </TableCell>
      <TableCell align='right'>
        <div className={styles.tableActions}>
          <IconButton
            aria-label='update'
            color='primary'
            onClick={() => {
              handleOpenEditModal({ author })
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            color='error'
            onClick={() => {
              handleOpenDeleteModal({ idToDelete: id })
            }}
          >
            <ClearIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  )
}
