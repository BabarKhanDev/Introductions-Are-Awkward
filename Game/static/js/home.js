let api_url = "http://127.0.0.1:5000"

async function main() {
    await build_login()
    console.log("Loaded JS")
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Build the page that a user first sees when they log in
async function build_login() {

    let username_label = document.createElement("label")
    username_label.innerHTML = "Username"

    let username_input = document.createElement("input")
    username_input.maxLength = 15
    username_input.placeholder = "max 15 chars"
    username_input.id = "username_input"

    let username_submit = document.createElement("button")
    username_submit.innerHTML = "Join"
    username_submit.id = "username_submit"
    username_submit.addEventListener("click", () => check_username())

    let main_section = document.getElementById("main")
    main_section.appendChild(username_label)
    main_section.appendChild(username_input)
    main_section.appendChild(username_submit)

}

async function check_username() {

    let response = await fetch("/new_user", {
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
    if (response_msg === "initial_user") {
        build_ready_up_button()
    }
    else if (response_msg === "success") {
        await build_waiting_for_state(2, "Waiting For All Players To Be Ready")
        build_harvesting_page()
    } else {
        alert("Username is taken, try again")
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

        await sleep(1000)
    }
}

function build_ready_up_button(){

    let ready_button = document.createElement("button")
    ready_button.innerHTML = "All Players Ready"
    ready_button.id = "ready_button"
    ready_button.addEventListener("click", () => submit_ready())

    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    main_section.appendChild(ready_button)
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

