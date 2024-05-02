import {build_waiting_for_state} from "./waiting.js";
import {build_results_page} from "./results.js";

export async function build_voting_page() {
    let main_section = document.getElementById("main")
    main_section.innerHTML = "Please drag the introduction to the matching player"

    let response = await fetch(`/${sessionStorage.getItem("game_key")}/all_introductions`, {
        method: "POST",
        cache: "no-cache",
        headers: {"Content-Type": "application/json",},
        referrerPolicy: "no-referrer",
        body: JSON.stringify({"username": sessionStorage.getItem("username")}),
    })

    let introductions = await response.json()

    let voting_area = document.createElement("div")
    voting_area.id = "voting_area"

    let name_area = document.createElement("div")
    name_area.id = "name_area"

    let intro_area = document.createElement("div")
    intro_area.id = "intro_area"

    // This is adapted from https://stackoverflow.com/a/74336249
    intro_area.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(intro_area, e.clientX, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
            intro_area.appendChild(draggable);
        } else {
            intro_area.insertBefore(draggable, afterElement);
        }
    });

    voting_area.append(name_area, intro_area)
    main_section.append(voting_area)

    introductions.players.forEach((name) => {
        let name_elem = document.createElement("p")
        name_elem.className = "voting_name"
        name_elem.textContent = name
        name_area.append(name_elem)
    })

    introductions.introductions.forEach((intro) => {
        let intro_elem = document.createElement("p")
        intro_elem.className = "voting_intro"
        intro_elem.setAttribute("draggable", "true")
        intro_elem.textContent = intro
        intro_elem.addEventListener("dragstart", () => {
            intro_elem.classList.add("dragging")
        });
        intro_elem.addEventListener("dragend", () => {
            intro_elem.classList.remove("dragging")
        });
        intro_area.append(intro_elem)
    })

    let submit_button = document.createElement("button")
    submit_button.id = "voting_submit"
    submit_button.innerText = "Submit"
    submit_button.addEventListener("click", async () => {

        let names = document.getElementsByClassName("voting_name")
        let intros = document.getElementsByClassName("voting_intro")

        let guess = {}
        for (let i = 0; i < names.length; i++) {
            guess[names[i].textContent] = intros[i].textContent
        }

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

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.voting_intro:not(.dragging)')]
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = x - (box.left + box.width / 2)
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        } else {
            return closest
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}