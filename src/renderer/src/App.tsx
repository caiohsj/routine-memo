import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Trash } from 'lucide-react'
import { Card, Badge, Button } from 'react-bootstrap'
import { FloatingActionButton } from './components/FloatingActionButton'
import { NoteForm, NoteFormInputs } from './components/NoteForm'
import { Note } from 'src/@types/note'

function App(): JSX.Element {
  const [unnotifiedNotes, setUnnotifiedNotes] = useState<Note[]>([])
  const [showNoteForm, setShowNoteForm] = useState(false)

  window.electron.ipcRenderer.on('load-notes', (_, notes) => {
    setUnnotifiedNotes(notes)
  })

  useEffect(() => {
    setInterval(() => {
      console.log(unnotifiedNotes)
      if (unnotifiedNotes?.length < 1) return

      const unnotifiedNote = unnotifiedNotes.find((note) => {
        const date = new Date()
        const noteDate = new Date(note.date)

        if (
          note.date &&
          noteDate.getDate() == date.getDate() &&
          noteDate.getMonth() == date.getMonth() &&
          noteDate.getFullYear() == date.getFullYear() &&
          noteDate.getHours() == date.getHours() &&
          noteDate.getMinutes() == date.getMinutes()
        ) {
          return note
        }

        if (
          note.date &&
          note.daily &&
          noteDate.getHours() == date.getHours() &&
          noteDate.getMinutes() == date.getMinutes()
        ) {
          return note
        }

        return undefined
      })

      if (unnotifiedNote == undefined) return

      window.electron.ipcRenderer.invoke('maximize-window')
    }, 60000) // per minute
  }, [unnotifiedNotes])

  const createNote = ({ title, description, date, time, daily }: NoteFormInputs): void => {
    const newNote = {
      id: uuidv4(),
      title,
      description,
      date: date && time ? new Date(`${date} ${time}`).toJSON() : '',
      daily
    }

    const notes = [...unnotifiedNotes, newNote]

    window.electron.ipcRenderer.send('store-notes', notes)
  }

  const deleteNote = (note: Note): void => {
    const newUnnotifiedNotes = unnotifiedNotes.filter((n) => n.id != note.id)
    window.electron.ipcRenderer.send('store-notes', newUnnotifiedNotes)
  }

  const dateFormat = (dateString: string): string => {
    const date = new Date(dateString)
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  }

  return (
    <div className="container">
      {showNoteForm ? <NoteForm handleForm={createNote} /> : <></>}

      {unnotifiedNotes?.map((note) => {
        return (
          <Card className="mt-3" key={note.id}>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between">
                <span>{note.title}</span>
                <div>
                  {note.date ? (
                    <Badge text="white" bg="info" pill={true}>
                      {dateFormat(note.date)}
                    </Badge>
                  ) : (
                    <></>
                  )}

                  {note.daily ? (
                    <Badge text="white" bg="success" pill={true}>
                      Nota diária
                    </Badge>
                  ) : (
                    <></>
                  )}
                  <Button className="ml-2" variant="danger" onClick={(): void => deleteNote(note)}>
                    <Trash />
                  </Button>
                </div>
              </Card.Title>
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
