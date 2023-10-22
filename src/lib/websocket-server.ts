import type { ViteDevServer } from 'vite';
import { Server, Socket } from "socket.io"

export interface WebsocketEvent {
	roomId: string
	type: "pause" | "play" | "sync"
	timestamp: number
}

let sockets: Socket[] = []

export const websocketServer = {
	name: "websocketServer",
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return

		const io = new Server(server.httpServer);

		io.on('connection', socket => {
			sockets.push(socket)
			console.log("Total sockets: " + sockets.length)
			console.log(`Connected to new client [${socket.handshake.address}]`)

			// Client requests that an event be broadcasted
			socket.on('request-event-broadcast', (event: WebsocketEvent) => {
				console.log("emitting")
				for (let sock of sockets) {
					console.log(socket.id, sock.id, "\n")
					sock.emit("event-broadcast", event)
				}
			})

			socket.on('disconnect', () => {
				sockets = sockets.filter(s => s.id != socket.id)
			})

		})

	}
}