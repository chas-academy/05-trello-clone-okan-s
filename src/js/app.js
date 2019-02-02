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
    
    DOM.$newListForm = $('#list-creation-dialog > form');
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
    DOM.$newListForm.on('submit', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  function unbindEvents() {
    DOM.$newListForm.unbind()
    DOM.$deleteListButton.unbind()
    
    DOM.$newCardForm.unbind()
    DOM.$deleteCardButton.unbind()
  }

  function update(){
    captureDOMEls()
    unbindEvents()
    bindEvents()

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


  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(e, title=null) {
    // console.log(e)
    if (e !== null){
      e.preventDefault();
    }
    
    console.log("This should create a new list");

    let finalTitle = ""
    if(title !== null){
      finalTitle = title
    } else {
      finalTitle = $('#list-creation-dialog').find('input').val()
    }

    let el = $(`
    <div class="column card-panel blue-grey" style="padding: calc(0.375vw + 0.375vh + 0.1875vmin); padding-bottom: 0;">
      <div class="list">

          <div class="list-header">
              <h4 style="margin: 0 !important; color: white;">
                  <span style="filter: drop-shadow(0 0 8px black);">${finalTitle}</span>
                  <button style="float: right;" class="delete waves-effect waves-light btn red accent-4">
                      <i class="large material-icons">delete_forever</i>
                  </button>
              </h4>
          </div>

          <ul class="list-cards">
              <li class="add-new card-panel white" style="padding: calc(0.4vw + 0.4vh + 0.2vmin);">
                  <form class="new-card">
                      <input type="text" name="title" placeholder="Enter new card title here" required/>
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
    $('#list-creation-dialog').parent().before(el)
    el.effect('pulsate')
    $('#list-creation-dialog').find('input').val(null)

    if (title === "Todo"){
      createCard(el, "Card #1")
    }
    if (title === "Doing"){
      createCard(el, "Card #2")
    }
    if (title === "Done"){
      createCard(el, "Card #3")
    }
      
    
    update()
  }

  function deleteList() {
    console.log("This should delete the list you clicked on");
    $(this).parentsUntil('.board').effect('fade', function() {$(this).parentsUntil('.board').remove()})
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(e, title = null) {
    if (e.type){
      e.preventDefault();
    }
    
    console.log("This should create a new card");

    let finalTitle = ""
    if(title !== null){
      finalTitle = title
    } else {
      finalTitle = $(this).find('input').val()
    }

    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniq_id = randLetter + Date.now();

    let el = $(`
    <li id="${uniq_id}" class="card card-panel blue-grey lighten-5 row valign-wrapper" style="padding: calc(0.4vw + 0.4vh + 0.2vmin);">
      ${finalTitle}

      <button style="margin-left: auto;" class="waves-effect waves-light btn-small blue" data="${uniq_id}">
          <i class="material-icons">open_in_browser</i>
      </button>

      <div class="dialog" title="${finalTitle}" id="${uniq_id}">
      </div>

      <button style="margin-left: calc(0.2vw + 0.2vh + 0.1vmin);" class="delete waves-effect waves-light btn-small red accent-4">
          <i class="material-icons">backspace</i>
      </button>
    </li>
    `)

    if (e.type){
      $(this).closest('.add-new').before(el)
      $(this).find('input').val(null)
    }else {
      e.find('.add-new').before(el)
    }

    $(`.dialog#${uniq_id}`).dialog({
      dragable: false,
      resizable: false,
      autoOpen: false,
      width: "347px",
      hide: {effect: "puff"} 
    })
    
    $(`.dialog#${uniq_id}`)
    .parent()
    .addClass('card card-panel blue-grey lighten-4')

    .find('.ui-dialog-titlebar')
    .addClass('card-title')
    .css('padding-left', '0.5em')
    .css('padding-right', '0.5em')

    .find('button')
    .removeAttr('class')
    .addClass('waves-effect waves-light btn-small red accent-4')
    .css('position', 'absolute')
    .css('right', '.3em')
    .html('<i class="material-icons">close</i>')

    .closest('.ui-dialog')
    .find('.ui-dialog-content')
    .html('<div class="card-action" id="tabs" style="padding: 0;"></div>')

    $(`.dialog#${uniq_id}`).parent().find('.card-action')
    .html(`
    <ul class="tabs blue-grey lighten-4">
      <li><a href="#tabs-1" style="margin-right: 0;">Description</a></li>
      <li><a href="#tabs-2" style="margin-right: 0;">Due Date</a></li>
    </ul>
    <div id="tabs-1">
      <label for="${uniq_id}1">Textarea</label>
      <textarea id="${uniq_id}1" class="materialize-textarea"></textarea>
    </div>
    <div id="tabs-2">
      Date: <input type="text" id="datepicker-${uniq_id}">
    </div>
    `)
    .tabs()

    $(`.dialog#${uniq_id}`).parent().find('.card-action > ul > li')
    .removeAttr('class')

    $(`.dialog#${uniq_id}`).parent().find(`.card-action #datepicker-${uniq_id}`)
    .datepicker({dateFormat: 'DD d MM yy'})

    el.find('.btn-small.blue').on('click', function() {
      $(`.dialog#${uniq_id}`).dialog('open')
    });

    $(`li#${uniq_id}.card`).effect('bounce')
    
    update()
  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
    $(this).closest('.card').effect('fade', function() {$(this).closest('.card').remove()})
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

    update();

    createList(null,"Todo")
    createList(null,"Doing")
    createList(null,"Done")
 
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
