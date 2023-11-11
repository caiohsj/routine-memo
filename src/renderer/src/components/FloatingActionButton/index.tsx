import { Button } from 'react-bootstrap'
import './style.css'

type FABProps = {
  children: JSX.Element,
  onClick(): void
}

const FloatingActionButton = ({ children, ...props }: FABProps): JSX.Element => (
  <Button className="fab" {...props}>
    {children}
  </Button>
)

export { FloatingActionButton }
