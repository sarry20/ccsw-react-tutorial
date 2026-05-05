import { useContext, useEffect, useState, type ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  useGetAllAuthorsQuery,
  useGetCategoriesQuery
} from '../../../redux/services/ludotecaApi'
import { LoaderContext } from '../../../context/LoaderProvider'
import type { Game } from '../../../types/Game'
import type { Category } from '../../../types/Category'
import type { Author } from '../../../types/Author'

interface Props {
  game: Game | null;
  handleCloseModal: () => void;
  create: (game: Game) => void;
  openCreate: boolean;
}

const initialState = {
  id: '',
  title: '',
  age: 0,
  category: undefined,
  author: undefined
}

export default function CreateGame (props: Props) {
  if (!props.openCreate) return null

  const [form, setForm] = useState<Game>(initialState)
  const loader = useContext(LoaderContext)
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery(null)
  const { data: authors, isLoading: isLoadingAuthors } =
    useGetAllAuthorsQuery(null)

  useEffect(() => {
    setForm({
      id: props.game?.id || '',
      title: props.game?.title || '',
      age: props.game?.age || 0,
      category: props.game?.category,
      author: props.game?.author
    })
  }, [props?.game])

  useEffect(() => {
    loader.showLoading(isLoadingCategories || isLoadingAuthors)
  }, [isLoadingCategories, isLoadingAuthors])

  const handleChangeForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value
    })
  }

  const handleChangeSelect = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const values = event.target.name === 'category' ? categories : authors
    setForm({
      ...form,
      [event.target.name]: values?.find((val) => val.id === event.target.value)
    })
  }

  return (
    <div>
      <Dialog open onClose={props.handleCloseModal}>
        <DialogTitle>
          {props.game ? 'Actualizar Juego' : 'Crear Juego'}
        </DialogTitle>
        <DialogContent>
          {props.game && (
            <TextField
              margin='dense'
              disabled
              id='id'
              label='Id'
              fullWidth
              value={props.game.id}
              variant='standard'
            />
          )}
          <TextField
            margin='dense'
            id='title'
            label='Titulo'
            fullWidth
            variant='standard'
            onChange={handleChangeForm}
            value={form.title}
          />
          <TextField
            margin='dense'
            id='age'
            label='Edad Recomendada'
            fullWidth
            type='number'
            variant='standard'
            onChange={handleChangeForm}
            value={form.age}
          />
          <TextField
            id='category'
            select
            label='Categoría'
            defaultValue="''"
            fullWidth
            variant='standard'
            name='category'
            value={form.category ? form.category.id : ''}
            onChange={handleChangeSelect}
          >
            {categories &&
              categories.map((option: Category) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            id='author'
            select
            label='Autor'
            defaultValue="''"
            fullWidth
            variant='standard'
            name='author'
            value={form.author ? form.author.id : ''}
            onChange={handleChangeSelect}
          >
            {authors &&
              authors.map((option: Author) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseModal}>Cancelar</Button>
          <Button
            onClick={() =>
              props.create({
                id: '',
                title: form.title,
                age: form.age,
                category: form.category,
                author: form.author
              })}
            disabled={
              !form.title || !form.age || !form.category || !form.author
            }
          >
            {props.game ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
