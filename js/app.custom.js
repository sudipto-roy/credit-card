(function(app) {
  var NS = {};

  var initCache = function() {
    NS.CACHE = {
      body: document.body,
      savedCardsWrapper : document.getElementById('savedCards'),
      ccDetailsForm : document.getElementById('ccDetailsForm'),
      ccNumberInput : document.getElementById('ccNumber'),
      ccExpiryMonthInput : document.getElementById('ccExpiryMonth'),
      ccExpiryYearInput : document.getElementById('ccExpiryYear'),
      cvvNumberInput : document.getElementById('cvvNumber'),
      submitCCDetailsButton : document.getElementById('submitCCDetails'),
      cardTypeSpan : document.getElementById('cardType')
    }
  };

  var initDomAndObj = function() {
    NS.savedCards = app.localDB.getObj('savedCards') || [];
    app.ajax.get('http://api.myjson.com/bins/fvzpp', function(data) {
      NS.apiResponse = JSON.parse(data);
    });
    app.populateCards(NS.CACHE.savedCardsWrapper);
  };

  var initEvents = function() {
    app.event.bind(NS.CACHE.ccNumberInput, 'input', _handleCCNumberKeyup);
    app.event.bind(NS.CACHE.ccDetailsForm, 'submit', _handleCCDetailsFormSubmit);
    app.event.bind(NS.CACHE.body, 'click', function(e) {
      _handleEditCard(e);
      _handleDeleteCard(e);
    })
  };

  function _handleCCNumberKeyup(e) {
    var cardRegex;
    for(var prop in NS.apiResponse) {
      cardRegex = app.strToRegex(NS.apiResponse[prop].cardPattern);
      if(cardRegex.test(e.target.value) && NS.apiResponse[prop].cardNumberLength == e.target.value.length) {
        NS.matchedCard = NS.apiResponse[prop];
        app.enableElements([NS.CACHE.ccExpiryMonthInput, NS.CACHE.ccExpiryYearInput, NS.CACHE.cvvNumberInput, NS.CACHE.submitCCDetailsButton]);
        NS.apiResponse[prop].cvv == 'required' ? NS.CACHE.cvvNumberInput.setAttribute('required', 'required') : NS.CACHE.cvvNumberInput.removeAttribute('required');
        NS.CACHE.cvvNumberInput.setAttribute('pattern', '[0-9]{'+NS.apiResponse[prop].cvvLength+'}');
        NS.CACHE.cvvNumberInput.focus();
        NS.CACHE.cardTypeSpan.innerHTML = NS.apiResponse[prop].displayText;
        break;
      }
      NS.matchedCard = {};
      app.disableElements([NS.CACHE.ccExpiryMonthInput, NS.CACHE.ccExpiryYearInput, NS.CACHE.cvvNumberInput, NS.CACHE.submitCCDetailsButton]);
      NS.CACHE.cardTypeSpan.innerHTML = '';
    }
  }

  function _handleCCDetailsFormSubmit(e) {
    var ccid = (new Date()).getTime().toString(),
      creditCard = {};
    e.preventDefault();
    
    creditCard[ccid] = new CreditCard(ccid, e.target.elements, NS.matchedCard.displayText);
    NS.savedCards.push(ccid);
    creditCard[ccid].save(NS.savedCards);
    e.target.reset();
    NS.CACHE.cardTypeSpan.innerHTML = '';
    app.disableElements([NS.CACHE.ccExpiryMonthInput, NS.CACHE.ccExpiryYearInput, NS.CACHE.cvvNumberInput, NS.CACHE.submitCCDetailsButton]);
  }

  function _handleEditCard(e) {
    var ccid,
      ccDetails;
    if(e.target.classList == 'edit-button') {
      ccid = e.target.getAttribute('data-ccid');
      ccDetails = app.localDB.getObj(ccid);
      for(prop in ccDetails) {
        NS.CACHE.ccDetailsForm.elements[prop] = ccDetails[prop];
      }
      NS.editId = ccid;
    }
  }

  function _handleDeleteCard(e) {
    var ccid;
    if(e.target.classList.contains('delete-button')) {
      ccid = e.target.getAttribute('data-ccid')
      app.localDB.delete(ccid);
      e.target.parentNode.classList.add('hide');
      NS.savedCards = NS.savedCards.filter(function(_ccid){
        if(_ccid == ccid) {
          return false;
        }
      });
      app.localDB.setObj('savedCards', NS.savedCards);
    }
  }

  var init = function() {
    initCache();
    initDomAndObj();
    initEvents();
  };

  app.custom = {
    init: init
  };
})(window.app = app || {});