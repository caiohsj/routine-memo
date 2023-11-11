import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Plus } from 'lucide-react'
import Card from 'react-bootstrap/Card'
import { FloatingActionButton } from './components/FloatingActionButton'
import { NoteForm, NoteFormInputs } from './components/NoteForm'

type Note = {
  id: string
  title: string
  description: string
  date: Date
}

function App(): JSX.Element {
  const [unnotifiedNotes, setUnnotifiedNotes] = useState<Note[]>([])

  useEffect(() => {
    setInterval(() => {
      if (unnotifiedNotes?.length < 1) return

      const unnotifiedNote = unnotifiedNotes.find((task) => {
        const date = new Date()

        if (
          task.date.getDate() == date.getDate() &&
          task.date.getMonth() == date.getMonth() &&
          task.date.getFullYear() == date.getFullYear() &&
          task.date.getHours() == date.getHours() &&
          task.date.getMinutes() == date.getMinutes()
        ) {
          return task
        }

        return undefined
      })

      if (unnotifiedNote == undefined) return

      window.electron.ipcRenderer.invoke('maximize-window')
    }, 60000) // per minute
  }, [])

  const createNote = ({ title, description, date, time }: NoteFormInputs): void => {
    const newNote = {
      id: uuidv4(),
      title,
      description,
      date: new Date(`${date} ${time}`)
    }

    setUnnotifiedNotes([...unnotifiedNotes, newNote])
  }

  return (
    <div className="container">
      <NoteForm handleForm={createNote} />

      {unnotifiedNotes?.map((note) => {
        return (
          <Card className="mt-3" key={note.id}>
            <Card.Body>
              <Card.Title>{note.title}</Card.Title>
              <Card.Text>{note.description}</Card.Text>
            </Card.Body>
          </Card>
        )
      })}

      <FloatingActionButton>
        <Plus />
      </FloatingActionButton>
    </div>
  )
}

export default App
