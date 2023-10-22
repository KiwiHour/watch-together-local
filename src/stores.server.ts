import { writable, type Writable } from "svelte/store"

export interface Room {
	id: string
	fileName: string | null
	state: "paused" | "playing" | null
}

function initRoomStore() {
	let { set, subscribe, update } = writable<Room[]>([])

	return {
		subscribe,
		create: (id: string) => update(rooms => [...rooms, { id, fileName: null, state: null }]),
		find: (id: string) => {
			let room: Room = {} as Room;
			update(rooms => { room = rooms.find(r => r.id == id) as Room; return rooms })
			return room;
		},
		updateFileName: (id: string, fileName: string) => {
			update(rooms => {
				(rooms.find(r => r.id == id) as Room).fileName = fileName
				return rooms
			})
		}
	}

}

export const rooms = initRoomStore()
