let api_url = "http://127.0.0.1:5000"

async function main() {

    // If the user has already logged in and is in the middle of the game
    if (sessionStorage.getItem("username") != null) {

        let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_state`)
        let state = await response.json()
        let waiting = sessionStorage.getItem("waiting")

        switch (state){
            case 1:
                await build_waiting_for_state(2, "Waiting For All Players To Join")
                await build_harvesting_page()
                break
            case 2:
                await build_harvesting_page()
                break
        }

    // If the user has created a game but has not inputted a username yet
    } else if (sessionStorage.getItem("game_key") != null) {
        await build_login()

    // If the user is new
    } else {
        sessionStorage.setItem("waiting", "false")
        await build_landing()

    }
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

async function join_game() {

    let username = document.getElementById("username_input").value
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/new_user`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
                "username":document.getElementById("username_input").value
            }
        ),
    })


    let response_msg = await response.json()
    if (response_msg === "Initial User") {
        sessionStorage.setItem("username", username)
        sessionStorage.setItem("initialUser", "true")
        await build_waiting_for_state(2, "Waiting For All Players To Join")
    }
    else if (response_msg === "Success") {
        sessionStorage.setItem("username", username)
        sessionStorage.setItem("initialUser", "false")
        await build_waiting_for_state(2, "Waiting For All Players To Join")
        await build_harvesting_page()
    } else if (response_msg === "Username Taken") {
        alert("Username is taken, try again")
    } else if (response_msg === "Invalid Key") {
        alert("Game Key not recognised, try again")
    } else {
        alert(`error, response = ${response_msg}`)
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

async function build_harvesting_page(){

    // Get timer
    let time_response = await fetch(`/${sessionStorage.getItem("game_key")}/timer_remaining`)
    let timer_remaining = await time_response.json()
    setTimeout(() => {alert("TIMER RAN OUT")}, timer_remaining)

    // Set up clock
    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    let clock = document.createElement("div")
    clock.id = "clock"
    clock.innerHTML = Math.floor(timer_remaining/1000 -1).toString()
    main_section.prepend(clock)
    setInterval(() => {
        let clock = document.getElementById("clock")
        let remaining_time = parseInt(clock.innerHTML)
        clock.innerHTML = (remaining_time - 1).toString()
    }, 1000);

    // Get a prompt
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_prompt`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
                "username":sessionStorage.getItem("username")
            }
        ),
    })
    let prompt = await response.json()

    let prompt_section = document.createElement("p")
    prompt_section.innerHTML = prompt

    let response_label = document.createElement("label")
    response_label.innerHTML = "Response"

    let response_input = document.createElement("input")
    response_input.id = "response_input"

    let prompt_submit = document.createElement("button")
    prompt_submit.innerHTML = "Submit"
    prompt_submit.addEventListener("click", () => submit_response())

    main_section.append(prompt_section, response_label, response_input, prompt_submit)
}

async function submit_response() {
    let response = document.getElementById("response_input")
    //TODO send the response back

    await build_harvesting_page()
}


async function build_waiting_for_state(state, waiting_text){

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