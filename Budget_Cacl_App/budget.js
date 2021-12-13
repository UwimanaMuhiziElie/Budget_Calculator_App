
// let budgetController = (() => {
//      do some cool stuffs here

//     let x = 39;

//     let add = (a) => {
//         return x + a;
//     };

//     return {
//         returnFunction: (b) => {
//             return add(b);
//         },
//     }
// })();

// let UIController = (() => {
//      even here
// })();

// let AppController = ((budgetCtrl, UICtrl) =>{
//     do some stuffs here
//     let testingFunction = budgetCtrl.returnFunction(7);
//     return {
//         anotherTestingFunction:() => {
//             console.log(testingFunction);
//         }
//     }
// })(budgetController, UIController);




let budgetController = (() => {
    //do some cool stuffs here

    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // Expense.prototype.calcPercentage = function(totalIncome) {
    //     if(totalIncome > 0){
    //         this.percentage = Math.round((this.value / totalIncome) * 100);
    //     } else {
    //         this.percentage = -1;
    //     }
    // };

    // Expense.prototype.getPercentage = function(){
    //     return this.percentage;
    // };


    let calculateTotal = (type) => {
        // let sum = data.allItems[type].reduce((prev, curr) => {
        //     return prev.value + curr.value;
        // });
        let sum = 0;
        data.allItems[type].forEach((curr) => {
            sum += curr.value;
        });

        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            inc:[],
            exp:[]
        },
        totals:{
            inc: 0,
            exp: 0
        },

        budget: 0,
        percentage: -1
    }

    return {

        addItem: (type, des, val) => {
            let ID, newItem;
            if (data.allItems[type].length > 0) {
                 ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if(type === "inc"){
                 newItem = new Income(ID, des, val);
            } else if(type === "exp"){
                 newItem = new Expense(ID, des, val);
            }

            data.allItems[type].push(newItem)

            return newItem;
        },


        deleteItem: (type, id) => {
            // var ids, index;

             let ids = data.allItems[type].map((current) => {
                return current.id;
            });

             let index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: () => {
            //1. calculate total income and total expenses
            calculateTotal("inc");
            calculateTotal("exp");
            //2. budget = total income - total expenses
            data.budget = data.totals.inc - data.totals.exp;
            //3. calculate the percentage of the income that we spent
            //percentage of the xpense = (income / expenses) * 100
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = "--";
            }
        },


        // CalculatePercentages: () => {
        //     data.allItems.exp.forEach((curr) => {
        //         return curr.calcPercentage();
        //     });
        // },

        getBudget: () => {
            //get the budget
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            };
        },

        testingFunctionalities: () => {
            console.log(data);
        },
    };
})();

                         /*****UI CONTROLLER**********/



let UIController = (() => {
    //even here
    let DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    }
    return {
        getInPut: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }     
        },

        addListItem: (obj, type) => {
            //1 creating an html with place holder text
            let html, element;
            if(type === "inc"){
                //display sth here
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp"){
                //display another thing here
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //2 replace the place holders with the actual value
            let newHtml = html.replace("%id%", obj.id);
            let newHtml1 = newHtml.replace("%description%", obj.description);
            let newHtml2 = newHtml1.replace("%value%", obj.value);

            //3 then insert html to the dom

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml2);
        },

        //delete item on the list
        deleteListItem: (selecctorID) => {
            let el = document.getElementById(selecctorID);
            el.parentNode.removeChild(el);
        },
        clearInputFields: () => {
            let inputFields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            let inputFieldsArray = Array.from(inputFields);
            inputFieldsArray.forEach((current, index, array) => {
                current.value = "";
            });

            inputFieldsArray[0].focus();
        },

        displayBudget: (obj) => {

            document.querySelector(".budget__income--value").textContent = obj.totalInc;
            document.querySelector(".budget__expenses--value").textContent = obj.totalExp;
            document.querySelector(".budget__value").textContent = obj.budget;
            document.querySelector(".budget__expenses--percentage").textContent = obj.percentage + "%";
        },

        //display the current date and time according to the timezone

        
        displayMonth: () => {
            let months = ["January", "February", "March", 
            "April", "May", "June", 
            "July", "August", "September",
             "October", "November", "December"];
            let now = new Date();
            let today = now.getDate();
            let month = now.getMonth();
            let year = now.getFullYear();
            document.querySelector(".budget__title--month").textContent = today + " "+ months[month] +" "+ year;
        },

        // changeType: () => {
        //     let fieldsInput = document.querySelectorAll(
        //         DOMstrings.inputType + "," + 
        //         DOMstrings.inputDescription + "," + 
        //         DOMstrings.inputValue
        //         );
        //     let fieldsInputArr = Array.from(fieldsInput);

        //     document.querySelector(DOMstrings.inputBtn).classList.toggle(".red");         


        // },



        getDOMstrings: () => {
            return DOMstrings;
        },
    }
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

        if(inPut.description !== "" && isNaN(inPut.description) && inPut.value > 0 && !isNaN(inPut.value)){
            //2 add the item to the budget controller
            let newitem = budgetCtrl.addItem(inPut.type, inPut.description, inPut.value);
            //3 add item to the ui
            let newListItem = UICtrl.addListItem(newitem, inPut.type);
    
            //4 clear the input fields
            UICtrl.clearInputFields();
            //5 calc and update the budget
            updateBudget();
        }
        
    };

    let ctrlDeleteItem = (event) => {
        
        let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
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

    //changing the type of Ui input fiedls

    // let chandedType = UICtrl.changeType();
    //seting event listeners
    let setUpEventListeners = () => {
       document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

       document.addEventListener("keypress", (event) => {
           if(event.keyCode === 13 || event.which === 13){
               ctrlAddItem();
           }
       });

       document.querySelector(".container").addEventListener("click", ctrlDeleteItem);
    //    document.querySelector(DOM.inputType).addEventListener("change", chandedType);
    }

    return {
        init:() => {
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
    }
})(budgetController, UIController);

AppController.init();