<script lang="ts">

    import { goto } from "$app/navigation";
    import { generateRoomId } from "$lib/functions";

	function joinRoom() {
		roomId = roomId.trim()
		if (roomId == "") return;

		gotoRoom(roomId)
	}

	async function createRoom() {
		let roomId = generateRoomId()
		await fetch("/", {
			method: "POST",
			body: JSON.stringify({ id: roomId })
		})
		
		gotoRoom(roomId)
	}

	function handleRoomIdKeyPress(event: KeyboardEvent) {
		if (event.key == "Enter")
			joinRoom()
	}

	let roomId: string;
	let gotoRoom = (id: string) => goto(`room?id=${id}`)

	export let data;

</script>

<main>

	{#if data.noRoomFound}
		<h1>Could not find a room with that ID</h1>
	{/if}
	
	<div id="wrapper">
		<div id="room-selector">
			<h2>Input Room ID</h2>
			<input bind:value={roomId} on:keypress={handleRoomIdKeyPress} type="text" name="room_id" id="room_id" placeholder="Room ID">
			<input on:click={joinRoom} type="button" value="Join Room">
		</div>
		<div id="room-creator">
			<p>Or</p>
			<input on:click={createRoom} type="button" value="Create room">
		</div>
	</div>

</main>

<style>

	main {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transform: translateY(20vh);
		gap: 10vh;
		text-align: center;
	}

</style>