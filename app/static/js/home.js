import {build_landing} from './landing.js';
import {build_login} from "./login.js";

window.onload = async function() {await main();};

async function main() {

    // If the user has already logged in and is in the middle of the game
    if (sessionStorage.getItem("username") != null) {

        let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_state`)
        let state = await response.json()

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

