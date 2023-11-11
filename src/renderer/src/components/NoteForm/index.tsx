import { Form, Button } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'

type NoteFormInputs = {
  title: string
  description: string
  date: string
  time: string
}

type NoteFormProps = {
  handleForm(data: NoteFormInputs): void
}

const NoteForm = ({ handleForm }: NoteFormProps): JSX.Element => {
  const { register, handleSubmit } = useForm<NoteFormInputs>()
  const onSubmit: SubmitHandler<NoteFormInputs> = (data) => handleForm(data)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="inputTitle">
        <Form.Label>Título</Form.Label>
        <Form.Control type="text" placeholder="Titulo da nota" {...register('title')} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputDescription">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Detalhes da nota"
          {...register('description')}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputDate">
        <Form.Label>Data da nota</Form.Label>
        <Form.Control className="mb-2" type="date" {...register('date')} />
        <Form.Control type="time" {...register('time')} />
      </Form.Group>

      <Button type="submit">Salvar</Button>
    </Form>
  )
}

export { NoteForm }

export type { NoteFormInputs }
