(function(app) {
  app.addClass = function(element, cssClass) {
    element.classList.add(cssClass);
  };
  app.removeClass = function(element, cssClass) {
    element.classList.remove(cssClass);
  };

  app.enableElements = function(arr) {
    arr.map(function(ele) {
      ele.removeAttribute('disabled');
    });
  }
  app.disableElements = function(arr) {
    arr.map(function(ele) {
      ele.setAttribute('disabled', true);
    });
  }

  app.ajax = {
    get : function(url, callback = {}) {
      var xhttp = new XMLHttpRequest(),
        response;
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && typeof callback == 'function') {
          callback(this.responseText);
        }
      };
      xhttp.open('GET', url, true);
      xhttp.send();
    },
    post : function(postdata, url, callback = {}) {
      var xhttp = new XMLHttpRequest(),
        response;
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && typeof callback == 'function') {
          callback(this.responseText);
        }
      };
      xhttp.open('POST', url);
      xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhttp.send(postdata);
    }
  };

  app.localDB = {
    set : function(key, value) {
      localStorage.setItem(key, value);
    },
    get : function(key) {
      return localStorage.getItem(key);
    },
    delete : function(key) {
      localStorage.removeItem(key);
    },
    setObj : function(key, objVal) {
      localStorage.setItem(key, JSON.stringify(objVal));
    },
    getObj : function(key) {
      return JSON.parse(localStorage.getItem(key));
    }
  };

  app.event = {
    bind : function(element, event, handler) {
      try {
        element.addEventListener(event, handler);
      } catch(err) {}
    },
    unbind : function(element, event) {
      try {
        element.removeEventListener(event, handler);
      } catch(err) {}
    }
  };

  app.strToRegex = function(regStr) {
    return new RegExp(regStr.slice(1, regStr.length - 1));
  };

  app.createDOMOfThisCard = function(ccid) {
    var ccDetails = app.localDB.getObj(ccid),
      li = document.createElement('li'),
      p = document.createElement('p'),
      button = document.createElement('button'),
      targetEl = targetEl || document.getElementById('savedCardsList'),
      tempP,
      editButton,
      deleteButton,
      attr;

    for(prop in ccDetails) {
      tempP = p.cloneNode();
      tempP.innerHTML = `${prop} : ${ccDetails[prop]}`;
      li.appendChild(tempP);
    }
    editButton = button.cloneNode();
    att = document.createAttribute('class');
    att.value = 'edit-button';
    editButton.setAttributeNode(att);
    att = document.createAttribute('data-ccid');
    att.value = ccid;
    editButton.setAttributeNode(att);
    editButton.innerHTML = 'Edit';

    deleteButton = button.cloneNode();
    att = document.createAttribute('class');
    att.value = 'delete-button';
    deleteButton.setAttributeNode(att);
    att = document.createAttribute('data-ccid');
    att.value = ccid;
    deleteButton.setAttributeNode(att);
    deleteButton.innerHTML = 'Delete';

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    targetEl.appendChild(li);
  }
  app.populateCards = function(targetEl) {
    var ul = document.createElement('ul'),
      savedCards = app.localDB.getObj('savedCards') || [],
      attr;
    att = document.createAttribute('id');
    att.value = 'savedCardsList';
    ul.setAttributeNode(att);
    targetEl.appendChild(ul);
    for(var i = 0; i<savedCards.length; i++) {
      app.createDOMOfThisCard(savedCards[i]);
    }
  };
})(window.app = {} || window.app);