import { IconButton, TableCell, TableRow } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import styles from '../Category.module.css'
import type { Category } from '../../../types/Category'

interface Props {
  category: Category;
  handleOpenEditModal: (props: {category: Category}) => void;
  handleOpenDeleteModal: (props: {idToDelete: string}) => void
}

export default function CategoryRow (props: Props) {
  const { category, handleOpenEditModal, handleOpenDeleteModal } = props
  const id = category.id
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component='th' scope='row'>
        {category.id}
      </TableCell>
      <TableCell component='th' scope='row'>
        {category.name}
      </TableCell>
      <TableCell>
        <div className={styles.tableActions}>
          <IconButton
            aria-label='update'
            color='primary'
            onClick={() => handleOpenEditModal({ category })}
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
