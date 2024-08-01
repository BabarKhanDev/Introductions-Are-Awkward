export async function build_results_page(){
    let main_section = document.getElementById("main")
    main_section.innerHTML = "Results page will go here"

    let response = await fetch(`/${sessionStorage.getItem("game_key")}/get_scores`)
    let results = await response.json()

    console.log(results)
}