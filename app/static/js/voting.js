import {build_waiting_for_state} from "./waiting.js";
import {build_results_page} from "./results.js";

export async function build_voting_page() {
    let main_section = document.getElementById("main")
    main_section.innerHTML = "Please drag the introduction to the matching player"

    // Get all introductions
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/all_introductions`, {
        method: "POST",
        cache: "no-cache",
        headers: {"Content-Type": "application/json",},
        referrerPolicy: "no-referrer",
        body: JSON.stringify({"username": sessionStorage.getItem("username")}),
    })
    let introductions = await response.json()

    // Set up voting area
    let voting_area = document.createElement("div")
    voting_area.id = "voting_area"


    let intro_area = document.createElement("div")
    intro_area.id = "intro_area"

    voting_area.append(intro_area)
    main_section.append(voting_area)

    // For each introduction, make an element for it
    introductions.introductions.forEach((intro) => {
        let intro_elem = document.createElement("div")
        intro_elem.className = "voting_intro"

        let intro_text = document.createElement("p")
        intro_text.className = "intro_text"
        intro_text.textContent = intro

        // Add list of all players to our introduction
        let player_vote_selector = document.createElement("select")
        player_vote_selector.className = "player_vote_selector"
        introductions.players.forEach((name) => {
            player_vote_selector.options.add( new Option(name, name))
        })
        intro_elem.append(intro_text, player_vote_selector)

        intro_area.append(intro_elem)
    })

    // Set up submit button
    let submit_button = document.createElement("button")
    submit_button.id = "voting_submit"
    submit_button.innerText = "Submit"
    submit_button.addEventListener("click", async () => {

        let intros = document.getElementsByClassName("voting_intro")

        let guess = {}
        for (let i = 0; i < intros.length; i++) {
            let selected_name = intros[i].querySelector(".player_vote_selector").value
            guess[selected_name] = intros[i].querySelector(".intro_text").textContent
        }
        console.log(guess)

        response = await fetch(`/${sessionStorage.getItem("game_key")}/submit_guess`, {
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json",},
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                "username": sessionStorage.getItem("username"),
                "guesses": guess
            }),
        })

        response = await fetch(`/${sessionStorage.getItem("game_key")}/get_round`)
        let round = await response.json()

        await build_waiting_for_state(5, "Waiting for all users to submit their votes")
        await build_results_page()
    })
    voting_area.append(submit_button)
}