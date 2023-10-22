<script lang="ts">

    import { invalidateAll } from '$app/navigation';
	import { io } from "socket.io-client"
    import { onMount, tick } from 'svelte';
	import Plyr from "plyr"
    import type { WebsocketEvent } from '$lib/websocket-server.js';
    import { generateRoomId } from '$lib/functions.js';

	export let data;

	async function handleFileSelect() {
		videoSelected = true;
		await tick();

		let files = fileInputElement.files as FileList
		let objUrl = URL.createObjectURL(files[0])
		
		videoElement.src = objUrl
		
		// Removes the file extension
		let fileName = files[0].name.split(".").slice(0, -1).join(".")
		await fetch("/room", {
			method: "POST",
			body: JSON.stringify({
				fileName,
				id: data.room.id
			})
		})

		await invalidateAll()

	} 

	function emitEvent(type: WebsocketEvent["type"]) {
		let event: WebsocketEvent = { 
				roomId: data.room.id,
				type,
				timestamp: videoElement.currentTime 
			}
		console.log(`emit: ${type}`)
		socket.emit("request-event-broadcast", event)
	}
	
	let videoElement: HTMLVideoElement
	let fileInputElement: HTMLInputElement
	let isMyRoom = !data.room.fileName
	let socket = io()
	let myId = generateRoomId()
	let videoSelected = false;
	
	socket.on("event-broadcast", async (event: WebsocketEvent) => {

		console.log(`recieve: ${event.type}`)
		console.log(videoElement.paused)
		switch (event.type) {
			case "sync":
				console.log(videoElement.currentTime, event.timestamp, videoElement.currentTime-Math.abs(event.timestamp) > 0.1)
				if (Math.abs(videoElement.currentTime-event.timestamp) > 0.1)
					videoElement.currentTime = event.timestamp
				else
					console.log("prevented sync")
				break
			case "pause":
				if (!videoElement.paused) {
					videoElement.pause()
					videoElement.currentTime = event.timestamp
				}
				break
			case "play":
				if (videoElement.paused) {
					videoElement.play()
					videoElement.currentTime = event.timestamp
				}
				break

		}

		console.log(videoElement.paused + "\n")
	})

</script>

{myId}
{#if !isMyRoom}
	<p>The host selected a file named "{data.room.fileName}"</p>
{/if}
<input bind:this={fileInputElement} type="file" on:change={handleFileSelect}>

{#if videoSelected}
	<video bind:this={videoElement} id="vid" controls on:play={() => emitEvent("play")} on:seeked={() => emitEvent("sync")} on:pause={() => emitEvent("pause")}>
		<track kind="captions">
	</video>
{/if}
