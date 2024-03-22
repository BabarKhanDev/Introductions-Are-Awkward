import {build_waiting_for_state} from "./waiting.js";

export async function build_introductions_page(){

    //Clear Page
    let main_section = document.getElementById("main")
    main_section.innerHTML = ""
    clearInterval(parseInt(sessionStorage.getItem("clock_interval")))

    // Get a prompt
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/sample_words`, {
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

    let words_json = await response.json()
    let words_list = words_json["words"]
    let target_user = words_json["target_user"]
    sessionStorage.setItem("target_user", target_user)

    let target_user_section = document.createElement("p")
    target_user_section.id = "target_user_p"
    target_user_section.textContent = `Please introduce ${target_user} to the rest of the group using the words below`

    let word_section = document.createElement("div")
    word_section.id = "word_section"

    words_list.forEach((word) => {
        let word_elem = document.createElement("p")
        word_elem.className = "word_elem"
        word_elem.textContent = word
        word_elem.addEventListener("click", () => {
            let word_elem_display = document.createElement("p")
            word_elem_display.className = "word_elem_display"
            word_elem_display.textContent = `${word}\u00a0`

            let response_input = document.getElementById("response_div")
            response_input.value += `${word} `
            response_input.append(word_elem_display)
        })
        word_section.append(word_elem)
    })

    let response_label = document.createElement("label")
    response_label.textContent = "Response"

    let response_input = document.createElement("div")
    response_input.id = "response_div"
    response_input.value = ""

    let clear_response = document.createElement("button")
    clear_response.textContent = "Clear"
    clear_response.addEventListener("click", () => {
        response_input.textContent = ""
        response_input.value = ""
    })

    let prompt_submit = document.createElement("button")
    prompt_submit.textContent = "Submit"
    prompt_submit.addEventListener("click", () => submit_response())

    main_section.append(target_user_section, word_section, response_label, response_input, clear_response, prompt_submit)
}

async function submit_response() {

    await fetch(`/${sessionStorage.getItem("game_key")}/submit_introduction`, {
        method: "POST",
        cache: "no-cache",
        headers: {"Content-Type": "application/json"},
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            "introduction": document.getElementById("response_div").value,
            "target_user": sessionStorage.getItem("target_user"),
            "username": sessionStorage.getItem("username")
        }),

    })

    let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_round`)
    let round = await response.json()
    await build_waiting_for_state(3 + round.round, "Waiting for all users to submit their prompts")
}