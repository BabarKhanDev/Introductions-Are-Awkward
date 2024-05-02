import {sleep} from "./util.js"
import {build_harvesting_page} from "./harvesting.js";

export async function build_waiting_for_state(desired_state, waiting_text) {

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""

    let text_element = document.createElement("p")
    text_element.innerHTML = waiting_text
    main_section.append(text_element)

    // Waiting for all users to join the game
    if (desired_state === 2) {
        let game_key_display = document.createElement("div")
        game_key_display.id = "game_key_display"
        game_key_display.innerHTML = `Game Key: ${sessionStorage.getItem("game_key")}`
        main_section.prepend(game_key_display)

        let player_list = document.createElement("div")
        player_list.id = "player_list"

        main_section.append(player_list)

        if (sessionStorage.getItem("initialUser") === "true") {
            let ready_button = document.createElement("button")
            ready_button.innerHTML = "All Players Ready"
            ready_button.id = "ready_button"
            text_element.innerHTML = "Connected Players:"
            ready_button.addEventListener("click", () => submit_ready())
            main_section.append(ready_button)
        }

    }

    // Waiting for all users to submit their introductions
    if (desired_state === 4) {
        let player_list = document.createElement("div")
        player_list.id = "player_list"
        main_section.append(player_list)

        let response = await fetch(`/${sessionStorage.getItem("game_key")}/submitted_introduction`)
        let player_map = await response.json()
        player_map = player_map.ready_players

        player_map.forEach((item) => {
            let username = item[0]
            let ready = item[1]
            let player_name_elem = document.createElement("p")
            player_name_elem.innerHTML = username
            player_name_elem.className = "player_name_waiting"
            player_name_elem.id = `player_name_${username}`
            if (ready) {
                player_name_elem.className += " ready"
            }
            player_list.append(player_name_elem)
        })
    }

    // Waiting for all users to submit their votes
    if (desired_state === 5) {
        let player_list = document.createElement("div")
        player_list.id = "player_list"
        main_section.append(player_list)

        let response = await fetch(`/${sessionStorage.getItem("game_key")}/submitted_votes`)
        let player_map = await response.json()
        player_map = player_map.ready_players

        player_map.forEach((item) => {
            let username = item[0]
            let ready = item[1]
            let player_name_elem = document.createElement("p")
            player_name_elem.innerHTML = username
            player_name_elem.className = "player_name_waiting"
            player_name_elem.id = `player_name_${username}`
            if (ready) {
                player_name_elem.className += " ready"
            }
            player_list.append(player_name_elem)
        })
    }

    while (true) {
        let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_state`)
        let current_state = await response.json()

        if (current_state === desired_state) {
            return
        }

        // Waiting for all users to join the game
        if (desired_state === 2) {
            // Show the logged in players
            let response = await fetch(`/${sessionStorage.getItem("game_key")}/all_players`)
            let players = await response.json()

            let player_list_elem = document.getElementById("player_list")
            if (players.players.length !== player_list_elem.children.length) {
                player_list_elem.innerHTML = ""
                players.players.forEach((player_name) => {
                    let player_name_elem = document.createElement("p")
                    player_name_elem.innerHTML = player_name
                    player_list_elem.append(player_name_elem)
                })
            }
        }

        // Waiting for all users to submit their introductions
        if (desired_state === 4) {
            let player_list_elem = document.getElementById("player_list")
            let response = await fetch(`/${sessionStorage.getItem("game_key")}/submitted_introduction`)
            let player_map = await response.json()
            player_map = player_map.ready_players

            player_map.forEach((item) => {
                let username = item[0]
                let ready = item[1]
                if (ready) {
                    document.getElementById(`player_name_${username}`).className = "player_name_waiting ready"
                }
            })
        }

        if (desired_state === 5) {
            let player_list_elem = document.getElementById("player_list")
            let response = await fetch(`/${sessionStorage.getItem("game_key")}/submitted_votes`)
            let player_map = await response.json()
            player_map = player_map.ready_players

            player_map.forEach((item) => {
                let username = item[0]
                let ready = item[1]
                if (ready) {
                    document.getElementById(`player_name_${username}`).className = "player_name_waiting ready"
                }
            })
        }

        await sleep(1000)
    }
}

async function submit_ready() {
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/all_ready`)
    let response_msg = await response.json()
    if (response_msg === "success") {
        await build_harvesting_page()
    } else {
        alert("Something went wrong, try again :(")
    }
}