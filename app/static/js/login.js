import {build_landing} from './landing.js';
import {build_harvesting_page} from "./harvesting.js";
import {build_waiting_for_state} from "./waiting.js";

export async function build_login() {

    let username_label = document.createElement("label")
    username_label.innerHTML = "Username"

    let username_input = document.createElement("input")
    username_input.maxLength = 15
    username_input.placeholder = "Max 15 chars"
    username_input.id = "username_input"

    let key_label = document.createElement("label")
    key_label.innerHTML = "Game Key"

    let key_input = document.createElement("input")
    key_input.maxLength = 4
    key_input.id = "key_input"
    key_input.placeholder = "Enter 4 Digit Game Key"

    let username_submit = document.createElement("button")
    username_submit.innerHTML = "Join"
    username_submit.id = "username_submit"
    username_submit.addEventListener("click", () => {
        sessionStorage.setItem("game_key", document.getElementById("key_input").value.toUpperCase());
        join_game()
    })

    let back_button = document.createElement("button")
    back_button.innerHTML = "Back"
    back_button.id = "back_button"
    back_button.addEventListener("click", () => {
        sessionStorage.clear()
        build_landing()
    })

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(username_label, username_input, key_label, key_input, username_submit, back_button)

}

export async function join_game() {

    let username = document.getElementById("username_input").value
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/new_user`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
                "username": document.getElementById("username_input").value
            }
        ),
    })

    let response_msg = await response.json()
    if (response_msg === "Initial User") {
        sessionStorage.setItem("username", username)
        sessionStorage.setItem("initialUser", "true")
        document.getElementById("tutorial_modal").remove()
        document.getElementById("tutorial_modal_blur").remove()
        await build_waiting_for_state(2, "Waiting For All Players To Join")
    } else if (response_msg === "Success") {
        sessionStorage.setItem("username", username)
        sessionStorage.setItem("initialUser", "false")
        document.getElementById("tutorial_modal").remove()
        document.getElementById("tutorial_modal_blur").remove()
        await build_waiting_for_state(2, "Waiting For Host To Start The Game")
        await build_harvesting_page()
    } else if (response_msg === "Username Taken") {
        alert("Username is taken, try again")
    } else if (response_msg === "Invalid Key") {
        alert("Game Key not recognised, try again")
    } else {
        alert(`error, response = ${response_msg}`)
    }
}