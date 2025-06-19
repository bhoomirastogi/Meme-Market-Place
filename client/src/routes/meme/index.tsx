import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meme/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/meme/"!</div>
}
