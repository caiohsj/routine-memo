import { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'

type Task = {
  title: string
  description: string
  date: string
}

function App(): JSX.Element {
  const [tasks] = useState<Task[]>()

  useEffect(() => {

  }, [])

  return (
    <div className="container">
      {tasks?.map((task) => {
        return (
          <Card key={task.title}>
            <Card.Body>
              <Card.Title>{task.title}</Card.Title>
              <Card.Text>{task.description}</Card.Text>
            </Card.Body>
          </Card>
        )
      })}
    </div>
  )
}

export default App
