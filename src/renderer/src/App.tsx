import { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { FloatingActionButton } from './components/FloatingActionButton'
import { Plus } from 'lucide-react'

type Note = {
  title: string
  description: string
  day?: number
  month?: number
  year?: number
  hour?: number
  minutes?: number
}

function App(): JSX.Element {
  const [unnotifiedNotes] = useState<Note[]>([])

  useEffect(() => {
    setInterval(() => {
      if (unnotifiedNotes?.length < 1) return

      const unnotifiedNote = unnotifiedNotes.find((task) => {
        const date = new Date()

        if (
          task.day == date.getDate() &&
          task.month == date.getMonth() + 1 &&
          task.year == date.getFullYear() &&
          task.hour == date.getHours() &&
          task.minutes == date.getMinutes()
        ) {
          return task
        }

        return undefined
      })

      if (unnotifiedNote == undefined) return

      window.electron.ipcRenderer.invoke('maximize-window')
    }, 60000) // per minute
  }, [])

  return (
    <div className="container">
      {unnotifiedNotes?.map((task) => {
        return (
          <Card key={task.title}>
            <Card.Body>
              <Card.Title>{task.title}</Card.Title>
              <Card.Text>{task.description}</Card.Text>
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
