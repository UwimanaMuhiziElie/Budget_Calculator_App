let budgetController = (() => {
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  let calculateTotal = type => {
    let sum = 0;
    data.allItems[type].forEach(curr => {
      sum += curr.value;
    });

    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },

    budget: 0,
    percentage: -1
  };

  return {
    addItem: (type, des, val) => {
      let ID, newItem;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      if (type === "inc") {
        newItem = new Income(ID, des, val);
      } else if (type === "exp") {
        newItem = new Expense(ID, des, val);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },

    deleteItem: (type, id) => {
      // var ids, index;

      let ids = data.allItems[type].map(current => {
        return current.id;
      });

      let index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: () => {
      calculateTotal("inc");
      calculateTotal("exp");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = "--";
      }
    },

    getBudget: () => {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentage
      };
    },

    testingFunctionalities: () => {
      console.log(data);
    }
  };
})();

/*****UI CONTROLLER**********/

let UIController = (() => {
  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };
  return {
    getInPut: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: (obj, type) => {
      //1 creating an html with place holder text
      let html, element;
      if (type === "inc") {
        //display sth here
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        //display another thing here
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //2 replace the place holders with the actual value
      let newHtml = html.replace("%id%", obj.id);
      let newHtml1 = newHtml.replace("%description%", obj.description);
      let newHtml2 = newHtml1.replace("%value%", obj.value);

      //3 then insert html to the dom

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml2);
    },

    //delete item on the list
    deleteListItem: selecctorID => {
      let el = document.getElementById(selecctorID);
      el.parentNode.removeChild(el);
    },
    clearInputFields: () => {
      let inputFields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      let inputFieldsArray = Array.from(inputFields);
      inputFieldsArray.forEach((current, index, array) => {
        current.value = "";
      });

      inputFieldsArray[0].focus();
    },

    displayBudget: obj => {
      document.querySelector(".budget__income--value").textContent =
        obj.totalInc;
      document.querySelector(".budget__expenses--value").textContent =
        obj.totalExp;
      document.querySelector(".budget__value").textContent = obj.budget;
      document.querySelector(".budget__expenses--percentage").textContent =
        obj.percentage + "%";
    },

    //display the current date and time according to the timezone

    displayMonth: () => {
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let now = new Date();
      let today = now.getDate();
      let month = now.getMonth();
      let year = now.getFullYear();
      document.querySelector(".budget__title--month").textContent =
        today + " " + months[month] + " " + year;
    },

    getDOMstrings: () => {
      return DOMstrings;
    }
  };
})();

/*****APP CONTROLLER**********/

let AppController = ((budgetCtrl, UICtrl) => {
  let DOM = UICtrl.getDOMstrings();

  let updateBudget = () => {
    //1. calculate budget
    budgetCtrl.calculateBudget();
    //2. return the budget
    let returnedBugdet = budgetCtrl.getBudget();
    // console.log(bugdets;
    //3. display on the ui)
    UICtrl.displayBudget(returnedBugdet);
  };
  let ctrlAddItem = () => {
    //1 fill the get input
    let inPut = UICtrl.getInPut();

    if (
      inPut.description !== "" &&
      isNaN(inPut.description) &&
      inPut.value > 0 &&
      !isNaN(inPut.value)
    ) {
      //2 add the item to the budget controller
      let newitem = budgetCtrl.addItem(
        inPut.type,
        inPut.description,
        inPut.value
      );
      //3 add item to the ui
      let newListItem = UICtrl.addListItem(newitem, inPut.type);

      //4 clear the input fields
      UICtrl.clearInputFields();
      //5 calc and update the budget
      updateBudget();
    }
  };

  let ctrlDeleteItem = event => {
    let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      let splitID = itemID.split("-");
      let type = splitID[0];
      let ID = parseInt(splitID[1]);

      //1. delete item in the data structure
      budgetCtrl.deleteItem(type, ID);
      //2. delete item on the ui
      UICtrl.deleteListItem(itemID);
      //3. update the budget
      updateBudget();
    }
  };

  let setUpEventListeners = () => {
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(".container")
      .addEventListener("click", ctrlDeleteItem);
    //    document.querySelector(DOM.inputType).addEventListener("change", chandedType);
  };

  return {
    init: () => {
      setUpEventListeners();
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        totalInc: 0,
        totalExp: 0,
        budget: 0,
        percentage: 0
      });
      console.log("the app is running");
    }
  };
})(budgetController, UIController);

AppController.init();
