import $ from 'jquery';

require('webpack-jquery-ui');
import '../css/styles.css';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function() {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');
    
    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > h4 > button.delete');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.card > button.delete');
  }

  function createTabs() {}
  function createDialogs() {}

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  function unbindEvents() {
    DOM.$newListButton.unbind()
    DOM.$deleteListButton.unbind()
    
    DOM.$newCardForm.unbind()
    DOM.$deleteCardButton.unbind()
  }

  function update(){
    captureDOMEls()
    unbindEvents()
    bindEvents()
  }

  
  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    event.preventDefault();
    console.log("This should create a new list");
    $('.board').append(`
    <div class="column card-panel blue-grey" style="padding: calc(0.375vw + 0.375vh + 0.1875vmin); padding-bottom: 0;">
      <div class="list">

          <div class="list-header">
              <h4 style="margin: 0 !important; color: white;">
                  <span style="filter: drop-shadow(0 0 8px black);">${$('#list-creation-dialog').find('input').val()}</span>
                  <button style="float: right;" class="delete waves-effect waves-light btn red accent-4">
                      <i class="large material-icons">delete_forever</i>
                  </button>
              </h4>
          </div>


          <ul class="list-cards">

              <li class="add-new card-panel white" style="padding: calc(0.4vw + 0.4vh + 0.2vmin);">
                  <form class="new-card" action="index.html">
                      <input type="text" name="title" placeholder="Enter new card title here" />
                      <div class="row center" style="margin: 0;">
                          <button class="add waves-effect waves-light btn-small center-align" style="width: 100%;">
                              Add card
                              <i class="material-icons" style="vertical-align: bottom;">add_to_photos</i>
                          </button>
                      </div>
                  </form>
              </li>

          </ul>

      </div>
    </div>
    `)
    $('#list-creation-dialog').find('input').val(null)
    update()
  }

  function deleteList() {
    console.log("This should delete the list you clicked on");
    $(this).parentsUntil('.board').remove();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    console.log("This should create a new card");
    $(this).closest('.add-new').before(`
    <li class="card card-panel blue-grey lighten-5 row valign-wrapper" style="padding: calc(0.4vw + 0.4vh + 0.2vmin);">
      ${$(this).find('input').val()}
      <button style="margin-left: auto;" class="dialog waves-effect waves-light btn-small blue">
          <i class="material-icons">open_in_browser</i>
      </button>
      <button style="margin-left: calc(0.2vw + 0.2vh + 0.1vmin);" class="delete waves-effect waves-light btn-small red accent-4">
          <i class="material-icons">backspace</i>
      </button>
    </li>
    `)
    $(this).find('input').val(null)
    update()
  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
    $(this).closest('.card').remove();
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log('☞ Initializing Okanban ☜');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();

    bindEvents();

    $(".list-cards").sortable({
      revert: 0,
      cursor:"grabbing",
      connectWith: ".list-cards",
    });

    $(".board").sortable({
      revert: 0,
      cursor:"grabbing",
    });
 
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function() {
  jtrello.init();
});
