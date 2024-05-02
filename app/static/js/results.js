import {sleep} from "./util.js";
import {build_harvesting_page} from "./harvesting.js";

export async function build_results_page() {
    let main_section = document.getElementById("main")
    main_section.innerHTML = ""

    let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_scores`)
    let results = await response.json()
    let scores = results.scores

    let title = document.createElement("p")
    title.id = "title"

    if (results.round == 4) {

        title.textContent = "The Final Results!"
        main_section.append(title)

        await build_results(scores, true)
        return
    }

    title.textContent = "The Score So Far!"
    main_section.append(title)

    await build_results(scores, false)

    // Tell the server that we are ready to move on
    setTimeout(async () => await alert_results_viewed(), 1000);

    // Wait for the game to go onto the next state
    await wait_for_harvesting()
    await build_harvesting_page()

}

async function build_results(scores, display_numbers) {

    createConfetti()

    let main_section = document.getElementById("main")

    for (let i = 0; i < Object.keys(scores).length; i++) {
        let username = Object.keys(scores)[i]
        await sleep(200)

        let results_elem = document.createElement("div")
        results_elem.className = "results_elem"

        let name_elem = document.createElement("div")
        name_elem.className = "results_name_elem"
        name_elem.textContent = username
        results_elem.append(name_elem)

        let score_elem = document.createElement("div")
        switch (i) {
            case 0:
                score_elem.className = "results_score_elem gold";
                break;
            case 1:
                score_elem.className = "results_score_elem silver";
                break;
            case 2:
                score_elem.className = "results_score_elem bronze";
                break;
            default:
                score_elem.className = "results_score_elem";
                break;
        }
        if (display_numbers) {
            score_elem.textContent = scores[username]

        } else {
            score_elem.textContent = "?"
        }

        results_elem.append(score_elem)
        main_section.append(results_elem)

        await sleep(1000)

    }
}

async function wait_for_harvesting() {
    while (true) {
        let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_state`)
        let current_state = await response.json()
        if (current_state === 2) {
            return
        }
        await sleep(1000)
    }
}

async function alert_results_viewed() {
    let response = await fetch(`/${sessionStorage.getItem("game_key")}/ready_for_next_round`, {
        method: "POST",
        cache: "no-cache",
        headers: {"Content-Type": "application/json"},
        referrerPolicy: "no-referrer",
        body: JSON.stringify({"username": sessionStorage.getItem("username")}),
    })
}

async function createConfetti() {

    function getRandomColor() {
        let colors = ["#ff5353", "#ffee53", "#53ffa9", "#5395ff", "#ef53ff"];
        let randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    let numConfetti = 200

    // Then let confetti fall
    for (let i = 0; i < numConfetti; i++) {

        let confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.rotate = Math.random() * 360 + "px"
        confetti.style.backgroundColor = getRandomColor()
        confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        confetti.style.top = "0px";

        // Set random position
        confetti.style.left = Math.random() * document.getElementById("main").offsetWidth + document.getElementById("main").offsetLeft + "px";

        // Append confetti to body
        document.body.appendChild(confetti);

        // Remove confetti after animation ends
        confetti.addEventListener("animationend", function () {
            confetti.remove();
        });

        await sleep(Math.random() * 20)
    }
}


