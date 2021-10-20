//nav buttons
const reset_game = document.getElementById('reset');
const new_game_btn = document.querySelector('#new-game');
const keyboard_keys = document.querySelector('#keys');


//hints
const modal_header = document.querySelector('#exampleModalLongTitle');
const hint_modal = document.querySelector('#modal-content');
const hint_1 = document.querySelector('#hint1');
const hint_2 = document.querySelector('#hint2');
const hint_3 = document.querySelector('#hint3');
const close_modal_button = document.querySelector('.modal-footer');

let movie_array1 = sessionStorage.getItem("movie_store");
let movie_array = JSON.parse(movie_array1);


//variables for calculations
let formatted_movie_array = [];
let createBlankMovie = "";
let getMovie = "";
let total_chances = 0;



new_game_btn.addEventListener('click', function () {
    formatAndReturnMovieArray();
    let randomMovie = getRandomMovieObject();
    createBlankMovie = randomMovie.name;
    getMovie = randomMovie;
    returnBlankFormattedMovie(createBlankMovie);
    new_game_btn.style.opacity = "0.0";
    new_game_btn.style.pointerEvents = "none";
    reset_game.style.opacity = "1.0";
    reset_game.style.pointerEvents = "visible";
    hint_1.style.opacity = "1.0";
    hint_1.style.pointerEvents = "visible";
    hint_2.style.opacity = "1.0";
    hint_2.style.pointerEvents = "visible";
    hint_3.style.opacity = "1.0";
    hint_3.style.pointerEvents = "visible";
    disableEnableKeyboardOnLoad(false , "1.0");
    console.log("MOVIE OBJECT : " + JSON.stringify(getMovie))
})


reset_game.addEventListener("click", function () {
    window.location.reload();
})

keyboard_keys.addEventListener("click", function () {
    fetchAndDisableButton();
})



//hints
hint_1.addEventListener("click", function () {

    modal_header.textContent = "CAST:"
    hint_modal.textContent = getMovie.actor;
    displayMessageModal();
    hint_1.disabled = true;
})

hint_2.addEventListener("click", function () {
    modal_header.textContent = "YEAR OF RELEASE:"
    hint_modal.textContent = getMovie.yearOfRelease;
    displayMessageModal();
    hint_2.disabled = true;
})

hint_3.addEventListener("click", function () {
    modal_header.textContent = "DIRECTOR:"
    hint_modal.textContent = getMovie.director;
    displayMessageModal();
    hint_3.disabled = true;

})


function returnBlankFormattedMovie(movieSplie) {

    for (let i = 0; i < movieSplie.length; i++) {
        let spanEle = document.createElement("span");
        spanEle.id = "button" + i;
        // btn.style.margin = "1rem";
        if (movieSplie[i] != '/') {
            spanEle.innerHTML = "_";
        } else {
            spanEle.innerHTML = movieSplie[i];
        }
        document.querySelector('.blank-container').appendChild(spanEle);
    }
}

function fetchAndDisableButton() {
    let elementClicked = window.event.target.id;
    if (elementClicked && elementClicked.startsWith("keyboard")) {
        let elementLocator = document.querySelector('#' + elementClicked);
        elementLocator.disabled = true;
        elementLocator.style.opacity = "0.1";
        let charConsole = elementLocator.innerHTML;
        decideGoodGuessBadGuess(charConsole);
        return charConsole;
    }
}

window.addEventListener('load', (event) => {
    reset_game.disabled = true;
    disableEnableKeyboardOnLoad(true , "0.1");
    new_game_btn.style.opacity = "1.0";
    reset_game.style.opacity = "0.0";
    reset_game.style.pointerEvents = "none";
    hint_1.style.opacity = "0.0";
    hint_1.style.pointerEvents = "none";
    hint_2.style.opacity = "0.0";
    hint_2.style.pointerEvents = "none";
    hint_3.style.opacity = "0.0";
    hint_3.style.pointerEvents = "none";

});

function disableEnableKeyboardOnLoad(bool, opacity) {
    for (let i = 1; i <= 36; i++) {
        document.getElementById('keyboard' + i).disabled = bool;
        document.getElementById('keyboard' + i).style.opacity = opacity;
    }
}

function decideGoodGuessBadGuess(charcterClicked) {
    let temp_chances = 0;
    for (let i = 0; i < createBlankMovie.length; i++) {
        if (createBlankMovie[i] == charcterClicked) {
            let fetched = document.querySelector('#button' + i);
            // fetched.style.border = "white";
            fetched.innerHTML = createBlankMovie[i];
            // fetched.style.padding = "1rem";
            continueCheckingWinner();
        } else {
            temp_chances++;
        }
    }
    if (temp_chances == createBlankMovie.length) {
        updateBollywoodGuesses();
    }
}

function updateBollywoodGuesses() {
    total_chances++;
    document.querySelector('#btn' + total_chances).style.opacity = "0.1";
    if (total_chances == 9) {
        new_game_btn.disabled = true;
        reset_game.disabled = false;
        disableEnableKeyboardOnLoad(true, "0.1");
        displayMessageModal();


        let movie = createBlankMovie.toString().replaceAll(',', '').replaceAll('/', ' ');
        modal_header.textContent = "MOVIE NAME WAS";
        hint_modal.textContent = movie;
        new_game_btn.disabled = true;
        $('#exampleModalCenter').on('hidden.bs.modal', function () {
            window.location.reload();
        })

    }
}

function continueCheckingWinner() {

    let anserOnUi = "";
    let finalAnswer = "";
    let movie_on_ui = document.querySelectorAll("body > div.guesser-container > div.blank-container > span");
    let movie_on_ui_len = movie_on_ui.length;
    for (let i = 0; i < movie_on_ui_len; i++) {
        anserOnUi += document.querySelector('#button' + i).innerHTML;
    }

    for (let i = 0; i < createBlankMovie.length; i++) {
        finalAnswer += createBlankMovie[i];
    }

    if (anserOnUi == finalAnswer && total_chances < 9) {
        new_game_btn.disabled = false;
        reset_game.disabled = true;
        disableEnableKeyboardOnLoad(true , 0.1);
        displayMessageModal();
        modal_header.textContent = "Hurray ! You Win !";
        hint_modal.textContent = "The Movie Was Indeed " + finalAnswer;
        new_game_btn.disabled = true;


        // $('#exampleModalCenter').on('hidden.bs.modal', function () {
        //     window.location.reload();
        // })
    }
  
}

function displayMessageModal() {
    $('#exampleModalCenter').modal('show');
    $('#exampleModalCenter').modal({
        backdrop: 'static',
        keyboard: false
    });
}




function formatAndReturnMovieArray() {

    for (let i = 0; i < movie_array.length; i++) {
        let formattedObject = "";
        let movie_name = movie_array[i].name;

        var find = '\\W+';
        var re = new RegExp(find, 'g');
        movie_name = movie_name.toUpperCase().replaceAll(re, ' ').trim().replaceAll(' ', '/');
        let splitMovie = movie_name.split('');
        formattedObject = {
            id: movie_array[i].id,
            name: splitMovie,
            actor: movie_array[i].actor,
            director: movie_array[i].director,
            yearOfRelease: movie_array[i].yearOfRelease
        }
        formatted_movie_array.push(formattedObject);
    }
    //  console.log("MOVIE ARRAY FETCHED : " +JSON.stringify(formatted_movie_array));
    return JSON.stringify(formatted_movie_array);

}


function getRandomMovieObject() {
    let radom_number = Math.floor(Math.random() * formatted_movie_array.length);
    return formatted_movie_array[radom_number];
}