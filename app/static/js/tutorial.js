let current_slide = 0

export function tutorial_setup() {

    create_tutorial_modal()

    document.getElementById("tutorial_button").addEventListener("click", () => {
        document.getElementById("tutorial_modal_blur").removeAttribute("hidden");
        document.getElementById("tutorial_modal").showModal()
        show_slide(0)
    })

}

document.addEventListener("keydown", (e) => {
   if (e.key === "Escape") {
       document.getElementById("tutorial_modal_blur").setAttribute("hidden", true)
   }
});

function create_tutorial_modal() {

    let modal = document.createElement("dialog")
    modal.id = "tutorial_modal"

    let modal_back = document.createElement("button")
    modal_back.textContent = "Back"
    modal_back.id = "tutorial_back"
    modal_back.hidden = true
    modal_back.addEventListener("click", () => {
        document.getElementById("tutorial_next").hidden = false
        show_slide(current_slide - 1)
    })

    let modal_next = document.createElement("button")
    modal_next.textContent = "Next"
    modal_next.id = "tutorial_next"
    modal_next.addEventListener("click", () => {
        document.getElementById("tutorial_back").hidden = false
        show_slide(current_slide + 1)
    })

    let modal_close = document.createElement("button")
    modal_close.textContent = "Close"
    modal_close.id = "tutorial_close"
    modal_close.addEventListener("click", () => {
        document.getElementById("tutorial_modal").close()
        document.getElementById("tutorial_modal_blur").setAttribute("hidden", true)
    })

    let modal_buttons = document.createElement("div")
    modal_buttons.id = "tutorial_buttons"
    modal_buttons.append(modal_back, modal_next, modal_close)

    let modal_title = document.createElement("h1")
    modal_title.textContent = "How to play"

    modal.append(modal_title, modal_buttons)

    // TODO once we have finished the rest of the game, make slides for it
    let slides = [
        create_slide(create_harvesting_display(), "First we will ask you to answer some questions about your fellow players.<br>Please be <b>very</b> descriptive!", 0),
        create_slide(create_introduction_display(), "Then we will ask you to describe one of the players, using only the words that other players used to describe them. <br> For every player who guesses correctly you get 1 point. <br> <b><i>Don't make it too easy though!</i></b><br>If everyone guesses correctly you get 0 points.", 1),
    ]

    let slide_indicators = create_slide_indicators(slides.length)

    slides.forEach(function(slide) {
        modal.append(slide)
    })
    modal.append(slide_indicators)

    let page = document.getElementById("body")
    page.append(modal)
}

function show_slide(slide_number) {

    // Hide active slide
    let slides = document.getElementsByClassName("slide")
    for (let item of slides) {
        item.style.display = "none"
    }

    let indicators = document.getElementsByClassName("slide_indicator")
    for (let item of indicators) {
        item.className = "slide_indicator"
    }

    // Show this slide
    let slide = document.getElementById(`slide_${slide_number}`)
    slide.style.display = "flex"

    let indicator = document.getElementById(`slide_indicator_${slide_number}`)
    indicator.classList.add("active")

    // Next and Back buttons
    current_slide = slide_number
    document.getElementById("tutorial_next").hidden = (
        slide_number === document.getElementsByClassName("slide_indicator").length - 1
    )

    document.getElementById("tutorial_back").hidden = (
        slide_number === 0
    )
}

function create_slide(display, caption, slide_number) {
    // Display is a DOM element that we will show with a caption next to it

    let text_elem = document.createElement("p")
    text_elem.innerHTML = caption

    let out = document.createElement("div")
    out.id = `slide_${slide_number}`
    out.className = "slide"
    out.append(display, text_elem)
    out.style.display = "none"

    return out
}

function create_slide_indicators(slides_count) {
    let out = document.createElement("div")
    out.id = "slide_indicators"

    for (let i= 0; i < slides_count; i++) {
        let indicator = document.createElement("div")
        indicator.id = `slide_indicator_${i}`
        indicator.className = "slide_indicator"
        indicator.addEventListener("click", function(){
            show_slide(this.id.slice(-1))
        })
        out.append(indicator)
    }

    return out
}

function create_harvesting_display() {

    let prompt_section = document.createElement("p")
    prompt_section.textContent = "Tell us a random fact about <player name>"

    let response_label = document.createElement("label")
    response_label.textContent = "Response"

    let response_input = document.createElement("input")
    response_input.id = "response_input"

    let prompt_submit = document.createElement("button")
    prompt_submit.textContent = "Submit"

    let out = document.createElement("div")
    out.className = "tutorial_display_DOM"
    out.append(prompt_section, response_label, response_input, prompt_submit)

    return out
}

function create_introduction_display() {

    let prompt_section = document.createElement("p")
    prompt_section.textContent = "Please describe <player name> using the words below"

    let words_list = "These words are taken from the facts that each player submitted about <player name>. Now use them to describe <player name>!".split(" ")

    let target_user_section = document.createElement("p")
    target_user_section.id = "target_user_p"
    target_user_section.textContent = "Please introduce <player name> to the rest of the group using the words below"

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
    })

    let prompt_submit = document.createElement("button")
    prompt_submit.textContent = "Submit"

    let out = document.createElement("div")
    out.className = "tutorial_display_DOM"
    out.append(target_user_section, word_section, response_label, response_input, clear_response, prompt_submit)

    return out
}