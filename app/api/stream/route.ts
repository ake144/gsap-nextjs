
export const dynamic = 'force-dynamic'
 
export async function GET() {
  const encoder = new TextEncoder()
  // Create a streaming response
  const customReadable = new ReadableStream({
    start(controller) {
			const message = 'Hey, I am a message.'
			controller.enqueue(encoder.encode(`data: ${message}\n\n`))
    },
  })
  // Return the stream response and keep the connection alive
  return new Response(customReadable, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
			'Content-Type': 'text/event-stream; charset=utf-8',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache, no-transform',
			'Content-Encoding': 'none'
		},
  })
}