async function main(){
    await render_player_list()
}

async function render_player_list(){

    function render_player_button(player){

        let name_tag = document.createElement("p")
        name_tag.innerHTML = player

        let kick_button = document.createElement("button")
        kick_button.addEventListener("click", () => kick_player(player))
        kick_button.innerHTML = "Kick"

        let container = document.createElement("div")
        container.append(name_tag, kick_button)
        container.className = "PlayerContainer"

        return container
    }

    async function kick_player(player){
        let response = await fetch("/kick_player", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                    "username":player
                }
            ),
        })

        let response_msg = await response.json()
        if (response_msg === "success"){
            await main()
        }
        else{
            alert("Something went wrong :(")
        }
    }

    let response = await fetch("/all_players")
    let response_msg = await response.json()
    document.getElementById("players").innerHTML = "<p>Players:<\p>"
    response_msg.players.forEach((player) => {
        document.getElementById("players").appendChild(render_player_button(player))
    })
}