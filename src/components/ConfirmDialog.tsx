import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  handleCloseModal: () => void;
  confirm: () => void;
  title: string;
  text: string;
  idToDelete: string;
}

export const ConfirmDialog = (props: Props) => {
  if (!props.idToDelete) return null
  return (
    <div>
      <Dialog open onClose={props.handleCloseModal}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseModal}>Cancelar</Button>
          <Button onClick={() => props.confirm()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
