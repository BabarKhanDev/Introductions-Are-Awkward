let api_url = "http://127.0.0.1:5000"

async function main() {
    await build_login()
    console.log("Loaded JS")
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

    let success_or_fail = await response.json()
    if (success_or_fail === "success") {
        alert("Success")
    } else {
        alert("Username is taken, try again")
    }

}
