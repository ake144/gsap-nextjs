'use client'
 
import { publishNotification } from '@/actions'
import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'
 
const Form = () => {
 
  // Use React's useFormStatus hook to detect form submission state
  const { pending } = useFormStatus()
 
  useEffect(() => {
    // If the form is not pending, reset the form
    if (!pending) (document?.getElementById('publish-form') as HTMLFormElement | null)?.reset()
  }, [pending])
 
  return (
    <form action={publishNotification} id="publish-form" className="flex flex-col gap-y-2  bg-white/50 p-4 rounded">
      <input placeholder="Your message" className="border rounded px-3 outline-none focus:border-black/50 py-2" type="text"  name="message" required />
      <button
				/* Disable button click while the form submission is pending */
				disabled={pending}
				className="hover:border-black/50 max-w-max border rounded py-1 px-3" type="submit"
			>
				{/* Display "pending" state placeholder */}
        {pending ? (
          <div className="flex flex-row gap-x-2 items-center">
            <div className="animate-spin border border-gray-800 rounded-full h-[15px] w-[15px]"></div>
            <span>Publishing</span>
          </div>
        ) : (
          <>Publish Notification &rarr;</>
        )}
      </button>
    </form>
  )
}
 
export default Form