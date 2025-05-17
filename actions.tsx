
'use server'
 
import { Redis } from '@upstash/redis'
import { console } from 'inspector'
import { headers } from 'next/headers'
 

export async function publishNotification(formData: any) {
  'use server'
  const redis = Redis.fromEnv()

console.log(Redis.fromEnv())
  console.log('Publishing notification', redis)
 
	// Extract the message in the form submitted
	const message = formData.get('message')
 
	// Obtain country of the user using Vercel's x-vercel-ip-country header
  const headersList = await headers()
  const country = headersList.get('x-vercel-ip-country')
 
	// Publish the message to the "posts" channel in Upstash Redis
  await redis.publish(
		'posts',
		JSON.stringify({
			message,
			country,
			date: new Date().toString(),
		}))
}