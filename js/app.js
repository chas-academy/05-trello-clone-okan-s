// Reavealing module pattern: https://bit.ly/1nt5vXP
const jtrello = (function () {
  const DOM = {};

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

  function createCard(e, title = null) {
    if (e.type) {
      e.preventDefault();
    }

    // console.log("This should create a new card");

    let finalTitle = '';
    if (title !== null) {
      finalTitle = title;
    } else {
      finalTitle = $(this).find('input').val();
    }

    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const uniqueID = randLetter + Date.now();

    const el = $(`
    <li id="${uniqueID}" class="card card-panel blue-grey lighten-5 row valign-wrapper" style="padding: calc(0.4vw + 0.4vh + 0.2vmin);">
      ${finalTitle}

      <button style="margin-left: auto;" class="waves-effect waves-light btn-small blue" id="${uniqueID}">
          <i class="material-icons">open_in_browser</i>
      </button>

      <div class="dialog" title="${finalTitle}" id="${uniqueID}">
      </div>

      <button style="margin-left: calc(0.2vw + 0.2vh + 0.1vmin);" class="delete waves-effect waves-light btn-small red accent-4">
          <i class="material-icons">backspace</i>
      </button>
    </li>
    `);

    if (e.type) {
      $(this).closest('.add-new').before(el);
      $(this).find('input').val(null);
    } else {
      e.find('.add-new').before(el);
    }

    $(`.dialog#${uniqueID}`).dialog({
      dragable: false,
      resizable: false,
      autoOpen: false,
      width: '347px',
      hide: { effect: 'puff' },
    });

    $(`.dialog#${uniqueID}`)
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
      .html('<div class="card-action" id="tabs" style="padding: 0;"></div>');

    $(`.dialog#${uniqueID}`).parent().find('.card-action')
      .html(`
    <ul class="tabs blue-grey lighten-4">
      <li><a href="#tabs-1" style="margin-right: 0;">Description</a></li>
      <li><a href="#tabs-2" style="margin-right: 0;">Due Date</a></li>
    </ul>
    <div id="tabs-1">
      <label for="${uniqueID}1">Textarea</label>
      <textarea id="${uniqueID}1" class="materialize-textarea"></textarea>
    </div>
    <div id="tabs-2">
      Date: <input type="text" id="datepicker-${uniqueID}">
    </div>
    `)
      .tabs();

    $(`.dialog#${uniqueID}`).parent().find('.card-action > ul > li')
      .removeAttr('class');

    $(`.dialog#${uniqueID}`).parent().find(`.card-action #datepicker-${uniqueID}`)
      .datepicker({ dateFormat: 'DD d MM yy' });

    $('.btn-small.blue').click(function () {
      const id = $(this).attr('id');
      $(`.dialog#${id}`).dialog('open');
    });

    $(`li#${uniqueID}.card`).effect('bounce');

    update();
  }

  function deleteCard() {
    // console.log("This should delete the card you clicked on");
    $(this).closest('.card').effect('fade', function () {
      $(this).closest('.card').remove();
    });
  }

  function createList(e, title = null) {
    if (e !== null) {
      e.preventDefault();
    }

    // console.log("This should create a new list");

    let finalTitle = '';
    if (title !== null) {
      finalTitle = title;
    } else {
      finalTitle = $('#list-creation-dialog').find('input').val();
    }

    const el = $(`
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
    `);
    $('#list-creation-dialog').parent().before(el);
    el.effect('pulsate');
    $('#list-creation-dialog').find('input').val(null);

    if (title === 'Todo') {
      createCard(el, 'Card #1');
    }
    if (title === 'Doing') {
      createCard(el, 'Card #2');
    }
    if (title === 'Done') {
      createCard(el, 'Card #3');
    }


    update();
  }

  function deleteList() {
    // console.log("This should delete the list you clicked on");
    $(this).parentsUntil('.board').effect('fade', function () {
      $(this).parentsUntil('.board').remove();
    });
  }

  function bindEvents() {
    DOM.$newListForm.on('submit', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  function unbindEvents() {
    DOM.$newListForm.unbind();
    DOM.$deleteListButton.unbind();

    DOM.$newCardForm.unbind();
    DOM.$deleteCardButton.unbind();
  }

  function update() {
    captureDOMEls();
    unbindEvents();
    bindEvents();

    $('.list-cards').sortable({
      revert: 0,
      cursor: 'grabbing',
      connectWith: '.list-cards',
    });

    $('.board').sortable({
      revert: 0,
      cursor: 'grabbing',
    });
  }

  $.widget('okanban.rainbow', {
    _create() {
      $('button#rainbow').click(() => {
        $('header').toggleClass('rainbow');
      });

      // if (localStorage.getItem('myKanban')){
      //   $('body').html(localStorage.getItem('myKanban'))
      // }

      // $("button#save-kanban").click(function () {
      //   localStorage.setItem('myKanban', $('body').html())
      // })

      // $("button#reset-kanban").click(function () {
      //   console.log("reset")
      //   localStorage.removeItem('myKanban');
      // })
    },
  });

  $('header').rainbow();

  function init() {
    // console.log('☞ Initializing Okanban ☜');
    captureDOMEls();
    update();

    if ($('.column').length <= 1) {
      createList(null, 'Todo');
      createList(null, 'Doing');
      createList(null, 'Done');
    }
  }

  return {
    init,
  };
}());

// usage
$('document').ready(() => {
  jtrello.init();
});
