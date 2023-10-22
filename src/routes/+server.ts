import { rooms } from '../stores.server.js'

export async function POST({ request }) {

	let data = await request.json()
	let id = data.id as string

	rooms.create(id)

	return new Response()

};