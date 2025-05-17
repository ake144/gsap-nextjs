'use client'

import { useEffect, useState } from 'react'
 
const ClientSideComponent = () => {
    const [messages, setMessages] = useState<string[]>([])
 
  useEffect(() => {
 
    // Initiate the first call to connect to SSE API
    const eventSource = new EventSource('/api/stream')
 
    eventSource.addEventListener('message', (event) => {
      // Parse the data received from the stream into JSON
      // Add it the list of messages seen on the page
      const tmp = JSON.parse(event.data)
      setMessages((prev) => [...(prev), tmp])

			// Do something with the obtained message
    })
    eventSource.addEventListener('error', (event) => {
        eventSource.close()
    })

    
 
    // As the component unmounts, close listener to SSE API
    return () => {
      eventSource.close()
    }
 
  }, [])
 
	return <>{messages}</>
}
 
export default ClientSideComponent


