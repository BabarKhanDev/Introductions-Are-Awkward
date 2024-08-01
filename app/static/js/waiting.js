import {sleep} from "./util.js"
import {build_harvesting_page} from "./harvesting";

export async function build_waiting_for_state(state, waiting_text){

    let text_element = document.createElement("p")
    text_element.innerHTML = waiting_text
    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(text_element)

    if (state === 2) {
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
            ready_button.addEventListener("click", () => submit_ready())
            main_section.append(ready_button)
        }

    }

    while (true){
        let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_state`)
        let response_msg = await response.json()

        if (response_msg === state){
            return
        }

        if (state === 2){
            // Show the logged in players
            let response = await fetch(`/${sessionStorage.getItem("game_key")}/all_players`)
            let players = await response.json()

            let player_list = document.getElementById("player_list")
            if (players.players.length !== player_list.children.length){

                player_list.innerHTML = ""
                players.players.forEach((player) => {
                    let player_name = document.createElement("p")
                    player_name.innerHTML = player
                    player_list.append(player_name)
                })
            }
        }
        await sleep(1000)
    }
}

async function submit_ready(){
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/all_ready`)
    let response_msg = await response.json()
    if (response_msg === "success"){
        await build_harvesting_page()
    }
    else{
        alert("Something went wrong, try again :(")
    }
}