import {build_introductions_page} from "./introductions.js";

export async function build_harvesting_page(){

    // Clear Page
    let main_section = document.getElementById("main")
    main_section.innerHTML = ""

    // Get timer
    let time_response = await fetch(`/${sessionStorage.getItem("game_key")}/timer_remaining`)
    let timer_remaining = await time_response.json()

    // Set up clock
    let clock = document.createElement("div")
    clock.id = "clock"
    clock.innerHTML = Math.floor(timer_remaining/1000 -1).toString()
    main_section.prepend(clock)

    if (sessionStorage.getItem("clock_interval") === null) {
        setTimeout(() => {build_introductions_page()}, timer_remaining)
        let my_interval = setInterval(async () => {
            let time_response = await fetch(`/${sessionStorage.getItem("game_key")}/timer_remaining`)
            let timer_remaining = await time_response.json()
            let clock = document.getElementById("clock")
            clock.innerHTML = Math.floor(timer_remaining/1000 -1).toString()
        }, 1000);
        sessionStorage.setItem("clock_interval", my_interval.toString())
    }


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
    let prompt_text = prompt["prompt"]
    let prompt_target_user = prompt["target_user"]
    sessionStorage.setItem("target_user", prompt_target_user)

    let prompt_section = document.createElement("p")
    prompt_section.innerHTML = prompt_text

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

    await fetch(`/${sessionStorage.getItem("game_key")}/submit_prompt_answer`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
                "answer": document.getElementById("response_input").value,
                "target_user": sessionStorage.getItem("target_user")
            }
        ),
    })

    await build_harvesting_page()
}