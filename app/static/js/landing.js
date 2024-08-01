import {build_login, join_game} from "./login.js"

export async function build_landing() {

    let join_button = document.createElement("button")
    join_button.id = "join_game_button"
    join_button.innerHTML = "Join Game"
    join_button.addEventListener("click", () => build_login())

    let new_game_button = document.createElement("button")
    new_game_button.id = "new_game_button"
    new_game_button.innerHTML = "New Game"
    new_game_button.addEventListener("click", () => build_new_game())

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(join_button, new_game_button)

}

async function build_new_game() {
    let response = await fetch(`/generate_key`)
    let game_key = await response.json()
    sessionStorage.setItem("game_key", game_key);

    let game_key_display = document.createElement("div")
    game_key_display.id = "game_key_display"
    game_key_display.innerHTML = `Game Key: ${game_key}`
    game_key_display.setAttribute("value", game_key)

    let username_label = document.createElement("label")
    username_label.innerHTML = "Username"

    let username_input = document.createElement("input")
    username_input.maxLength = 15
    username_input.placeholder = "Max 15 chars"
    username_input.id = "username_input"

    let username_submit = document.createElement("button")
    username_submit.innerHTML = "Join"
    username_submit.id = "username_submit"
    username_submit.addEventListener("click", () => {join_game()})

    let back_button = document.createElement("button")
    back_button.innerHTML = "Back"
    back_button.id = "back_button"
    back_button.addEventListener("click", () => {
        sessionStorage.clear()
        build_landing()
    })

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(game_key_display, username_label, username_input, username_submit, back_button)

}
