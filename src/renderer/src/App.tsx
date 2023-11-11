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
  const [showNoteForm, setShowNoteForm] = useState(false)

  useEffect(() => {
    setInterval(() => {
      if (unnotifiedNotes?.length < 1) return

      const unnotifiedNote = unnotifiedNotes.find((note) => {
        const date = new Date()

        if (
          note.date.getDate() == date.getDate() &&
          note.date.getMonth() == date.getMonth() &&
          note.date.getFullYear() == date.getFullYear() &&
          note.date.getHours() == date.getHours() &&
          note.date.getMinutes() == date.getMinutes()
        ) {
          return note
        }

        return undefined
      })

      if (unnotifiedNote == undefined) return

      window.electron.ipcRenderer.invoke('maximize-window')
    }, 60000) // per minute
  }, [unnotifiedNotes])

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
      {showNoteForm ? <NoteForm handleForm={createNote} /> : <></>}

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

      <FloatingActionButton onClick={(): void => setShowNoteForm(!showNoteForm)}>
        <Plus />
      </FloatingActionButton>
    </div>
  )
}

export default App
