import { redirect } from "@sveltejs/kit";
import { rooms } from "../../stores.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url }) => {

	let roomId = url.searchParams.get("id") as string
	let room = rooms.find(roomId)

	if (!room) {
		console.log("redir")
		throw redirect(302, "/?noroom")
	}

	return {
		room
	}
};