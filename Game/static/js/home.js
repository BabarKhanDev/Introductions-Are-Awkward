let api_url = "http://127.0.0.1:5000"

async function main() {
    await build_landing()
    console.log("Loaded JS")
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function build_landing() {

    let join_button = document.createElement("button")
    join_button.id = "join_game_button"
    join_button.innerHTML = "Join Game"
    join_button.addEventListener("click", () => build_login())

    let new_game_button = document.createElement("button")
    new_game_button.id = "new_game_button"
    new_game_button.innerHTML = "New Game"
    new_game_button.addEventListener("click", () => build_new_game())

    let main_section = document.getElementById("main")
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
    username_input.placeholder = "max 15 chars"
    username_input.id = "username_input"

    let username_submit = document.createElement("button")
    username_submit.innerHTML = "Join"
    username_submit.id = "username_submit"
    username_submit.addEventListener("click", () => {join_game()})

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(game_key_display, username_label, username_input, username_submit)

}


async function build_login() {

    let username_label = document.createElement("label")
    username_label.innerHTML = "Username"

    let username_input = document.createElement("input")
    username_input.maxLength = 15
    username_input.placeholder = "max 15 chars"
    username_input.id = "username_input"

    let key_label = document.createElement("label")
    key_label.innerHTML = "Game Key"

    let key_input = document.createElement("input")
    key_input.maxLength = 4
    key_input.id = "key_input"

    let username_submit = document.createElement("button")
    username_submit.innerHTML = "Join"
    username_submit.id = "username_submit"
    username_submit.addEventListener("click", () => {
        sessionStorage.setItem("game_key", document.getElementById("key_input").value);
        join_game()
    })

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(username_label, username_input, key_label, key_input, username_submit)

}

async function join_game() {

    let game_key = sessionStorage.getItem("game_key")
    let username = document.getElementById("username_input").value
    let response = await fetch(`/${game_key}/new_user`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
                "username":username
            }
        ),
    })

    let response_msg = await response.json()
    if (response_msg === "Initial User") {
        build_ready_up_button()
    }
    else if (response_msg === "Success") {
        sessionStorage.setItem("Username", username)
        await build_waiting_for_state(2, "Waiting For All Players To Be Ready")
        build_harvesting_page()
    } else if (response_msg === "Username Taken") {
        alert("Username is taken, try again")
    } else if (response_msg === "Invalid Key") {
        alert("Game Key not recognised, try again")
    } else {
        alert(`error, response = ${response_msg}`)
    }
}

async function build_waiting_for_state(state, waiting_text){

    let text_element = document.createElement("p")
    text_element.innerHTML = waiting_text

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.appendChild(text_element)

    while (true){
        let response = await fetch("get_state")
        let response_msg = await response.json()

        if (response_msg === state){
            return
        }

        if (state === 1) {
            // We are waiting for all players to log in, show logged in players

        }

        await sleep(1000)
    }
}

function build_ready_up_button(){

    let game_key = sessionStorage.getItem("game_key")
    let game_key_display = document.createElement("div")
    game_key_display.id = "game_key_display"
    game_key_display.innerHTML = `Game Key: ${game_key}`
    game_key_display.setAttribute("value", game_key)

    let ready_button = document.createElement("button")
    ready_button.innerHTML = "All Players Ready"
    ready_button.id = "ready_button"
    ready_button.addEventListener("click", () => submit_ready())

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.append(game_key_display, ready_button)
}

async function submit_ready(){
    let response = await fetch("/all_ready")
    let response_msg = await response.json()
    if (response_msg === "success"){
        build_harvesting_page()
    }
    else{
        alert("Something went wrong, try again :(")
    }
}

function build_harvesting_page(){
    let main_section = document.getElementById("main")
    main_section.innerHTML = "Harvesting Time!"
}

