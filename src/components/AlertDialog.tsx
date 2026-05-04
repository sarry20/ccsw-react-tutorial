import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  handleCloseModal: () => void;
  title: string;
  text: string;
}

export const AlertDialog = (props: Props) => {
  return (
    <div>
      <Dialog open onClose={props.handleCloseModal}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseModal}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
