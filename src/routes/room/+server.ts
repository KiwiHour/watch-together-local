import type { RequestHandler } from "@sveltejs/kit";
import { rooms } from "../../stores.server";

export const POST: RequestHandler = async ({ request }) => {

	let data = await request.json()
	let fileName = data.fileName as string
	let id = data.id as string

	console.log("updated")
	rooms.updateFileName(id, fileName)

	return new Response();
};