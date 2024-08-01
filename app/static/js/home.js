import {build_landing} from './landing.js';
import {build_login} from "./login.js";
import {build_harvesting_page} from "./harvesting.js";
import {build_waiting_for_state} from "./waiting.js";
import {build_introductions_page} from "./introductions.js";
import {build_voting_page} from "./voting.js";
import {build_results_page} from "./results.js";

window.onload = async function() {await main();};

async function main() {

    if (sessionStorage.getItem("username") != null) {
    // User has already logged in and is in the middle of the game

        let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_state`)
        let state = await response.json()
        switch (state){
            case 1:
                await build_waiting_for_state(2, "Waiting For Host To Start The Game")
                break
            case 2:
                await build_harvesting_page()
                break
            case 3:
                let response = await fetch(`/${sessionStorage.getItem("game_key")}/submitted_introduction`)
                let player_map = await response.json()
                player_map = player_map.ready_players
                player_map.forEach( (item) => {
                    let username = item[0]
                    let ready = item[1]
                    if (username === sessionStorage.getItem("username")) {
                        if (ready) {
                            build_waiting_for_state(4, "Waiting for all users to submit their prompts")
                        } else {
                            build_introductions_page()
                        }
                    }
                })
                break
            case 4:
                await build_voting_page()
                break
            case 5:
                await build_results_page()
                break
        }

    } else if (sessionStorage.getItem("game_key") != null) {
        // User has created a game but has not inputted a username yet
        await build_login()

    } else {
        // New user
        sessionStorage.setItem("waiting", "false")
        await build_landing()
    }
    console.log("Loaded JS")
}
