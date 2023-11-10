import { Button } from 'react-bootstrap'
import './style.css'

type FABProps = {
  children: JSX.Element
}

const FloatingActionButton = ({ children }: FABProps): JSX.Element => (
  <Button className="fab">{children}</Button>
)

export { FloatingActionButton }
