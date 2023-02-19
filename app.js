//storage controller
const storageCtrl = (function() {


  //public methods
  return {
    storeItem: function(item) {
      let items;
      //check if there any items in the local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item)
        //set to local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        //push item to arr
        items.push(item);
        //reset localstorage
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromLocalStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach(function(item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem)

        }
      });
      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItemFromLocalStorage: function(id) {
        let items = JSON.parse(localStorage.getItem("items"));

        items.forEach(function (item, index) {
          if (id === item.id) {
            items.splice(index, 1);
          }
        });
        localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllFromLocalStorage: function() {
      localStorage.removeItem('items')
    }
  }
})();


//item controller
const itemCtrl = (function(){
    // item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //data constructor/state
    const data = {
      items: storageCtrl.getItemsFromLocalStorage(),
      currentItem: null,
      totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // create id
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0
            }
            //calories to number
           calories = parseInt(calories)
           //create new item (instantiate)
           newItem = new Item(ID, name, calories);
           //push to array
           data.items.push(newItem);

           return newItem
        },
        getItemById: function(id) {
            let found = null;
            //loop through all items
            data.items.forEach(function(item){
                if (item.id === id) {
                    found = item
                }
            })
            return found
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found
        },
        deleteItem: function(id) {
            const ids = data.items.map(function(item){
              return item.id
            });
            //get index
            const index = ids.indexOf(id)

            //remove item
            data.items.splice(index, 1)
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            //loop through items and add cals
            data.items.forEach(function(item) {
                total += item.calories
            })
            //set total calories in data structure
            data.totalCalories = total;
            //return total
            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})()


//ui controller
const uiCtrl = (function(){
    const uiSelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCalInput: '#item-calories',
        totalCalories: '.total-calories',
        clearBtn: '.clear-btn'
    }
    return {
      populateItemList: function (items) {
        let html = "";

        items.forEach(function (item) {
          html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                             <a href="#" class="secondary-content">
                            <i class="delete-btn material-icons red-text">delete</i>
                            </a>
                            <a href="#" class="secondary-content">
                                <i class="edit-item material-icons pink-text">create</i>
                                 <strong>&nbsp </strong>
                            </a>
                        </li>`;
        });

        //insert list items
        document.querySelector(uiSelectors.itemList).innerHTML = html;
      },
      getItemInput: function () {
        return {
          name: document
            .querySelector(uiSelectors.itemNameInput).value.toUpperCase(),
          //only number in the calorie input field

          calories: document
            .querySelector(uiSelectors.itemCalInput).value
        };
      },
      addListItem: function (item) {
        //show the list
        document.querySelector(uiSelectors.itemList).style.display = 'block'
        //create li element
        const li = document.createElement("li");
        li.className = "collection-item";
        // add id
        li.id = `item-${item.id}`;
        // add html
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                            <i class="delete-btn material-icons red-text">delete</i>
                            </a>
                            <a href="#" class="secondary-content">
                                <i class="edit-item material-icons pink-text">create</i>
                                <strong>&nbsp  </strong>
                            </a>`;
        //insert item
        document
          .querySelector(uiSelectors.itemList)
          .insertAdjacentElement("beforeend", li);
      },
      updateListItem: function(item) {
        let listItems = document.querySelectorAll(uiSelectors.listItems);
        //convert node list to arr
        listItems = Array.from(listItems);

        listItems.forEach(function(listItem) {
            const itemID = listItem.getAttribute('id');

            if (itemID === `item-${item.id}`){
                document.querySelector(
                  `#${itemID}`
                ).innerHTML = `<strong>${item.name}: </strong>
                                    <em>${item.calories} Calories</em>
                                     <a href="#" class="secondary-content">
                                      <i class="delete-btn material-icons red-text">delete</i>
                                    </a>
                                    <a href="#" class="secondary-content">
                                        <i class="edit-item material-icons pink-text">create</i>

                                    </a>`;
            }
        })
      },
      deleteListItem: function(id) {
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
      },
      clearInput: function () {
        document.querySelector(uiSelectors.itemNameInput).value = "";
        document.querySelector(uiSelectors.itemCalInput).value = "";
      },
      addItemToForm: function () {
        document.querySelector(uiSelectors.itemNameInput).value =
          itemCtrl.getCurrentItem().name;
        document.querySelector(uiSelectors.itemCalInput).value =
          itemCtrl.getCurrentItem().calories;
        uiCtrl.showEditState();
      },
      hideList: function () {
        document.querySelector(
          uiSelectors.itemList
        ).style.display = "none";
      },
      removeItems: function() {
        let listItems = document.querySelectorAll(uiSelectors.listItems);

        //turn node list to arry
        listItems = Array.from(listItems);

        listItems.forEach(function(item) {
          item.remove();
        })
      },
      showTotalCalories: function (totalCalories) {
        document.querySelector(uiSelectors.totalCalories).textContent =
          totalCalories;
      },
      clearEditState: function () {
        uiCtrl.clearInput();
        document.querySelector(uiSelectors.updateBtn).style.display = "none";
        // document.querySelector(uiSelectors.deleteBtn).style.display = "none";
        document.querySelector(uiSelectors.backBtn).style.display = "none";
        document.querySelector(uiSelectors.addBtn).style.display = "inline";
      },
      showEditState: function () {
        document.querySelector(uiSelectors.updateBtn).style.display = "inline";
        // document.querySelector(uiSelectors.deleteBtn).style.display = "inline";
        document.querySelector(uiSelectors.backBtn).style.display = "inline";
        document.querySelector(uiSelectors.addBtn).style.display = "none";
      },
      getSelectors: function () {
        return uiSelectors;
      },
    };
})();


//app controller
const appCtrl = (function(itemCtrl, storageCtrl, uiCtrl){
    //initializer

    //load event listeners
    const loadEventListeners = function(){
      const uiSelectors = uiCtrl.getSelectors();
      //add item event
      document
        .querySelector(uiSelectors.addBtn)
        .addEventListener("click", itemAddSubmit);

      //disable submit by pressing enter
      document.addEventListener("keypress", function (e) {
        if (e.keyCode === 13 || e.which === 13) {
          e.preventDefault();
          return false;
        }
      });

      //edit click event
      document
        .querySelector(uiSelectors.itemList)
        .addEventListener("click", itemEditClick);

      //delete button item event
      document
        .querySelector(uiSelectors.itemList)
        .addEventListener("click", itemDeleteClick);

      //clear all button event
      document
        .querySelector(uiSelectors.clearBtn)
        .addEventListener("click", clearAllClick);

      //update item event
      document
        .querySelector(uiSelectors.updateBtn)
        .addEventListener("click", itemUpdateSubmit);

      //back button item event
      document
        .querySelector(uiSelectors.backBtn)
        .addEventListener("click", uiCtrl.clearEditState);
    }

    //add item submit
    const itemAddSubmit = function(e) {
        //get form input from uiCtrl
        const input = uiCtrl.getItemInput();

        //check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
          //add item
          const newItem = itemCtrl.addItem(input.name, input.calories);
          //add item to ui list
          uiCtrl.addListItem(newItem);
          //get total calories
          const totalCalories = itemCtrl.getTotalCalories();
          //add total calories to ui
          uiCtrl.showTotalCalories(totalCalories);
          //store in Local Storage
          storageCtrl.storeItem(newItem);

        //clear fields
        uiCtrl.clearInput();
        }

        e.preventDefault()
    }

    //edit item, click handler
    const itemEditClick = function(e){
        if (e.target.classList.contains('edit-item')) {
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            //split the id to arr
            const listIdArr = listId.split('-');
            //get the actual id
            const id = parseInt(listIdArr[1])

            const itemToEdit = itemCtrl.getItemById(id)
            //set curr item
            itemCtrl.setCurrentItem(itemToEdit)
            //add edit function to form
            uiCtrl.addItemToForm();
        }

        e.preventDefault();
    }
    const itemUpdateSubmit = function(e) {
        //get item input
        const input = uiCtrl.getItemInput();

        //update item
        const updatedItem = itemCtrl.updateItem(input.name, input.calories)

        //update ui
        uiCtrl.updateListItem(updatedItem)

        //get total calories
        const totalCalories = itemCtrl.getTotalCalories();
        //add the updated total calories to ui
        uiCtrl.showTotalCalories(totalCalories);
        //update item in local storage
        storageCtrl.updateItemStorage(updatedItem)

        uiCtrl.clearEditState();

        e.preventDefault()
    }

    //delete button event

    const itemDeleteClick = function(e) {
      if (e.target.classList.contains('delete-btn')) {
        //get current item
        const listId = e.target.parentNode.parentNode.id;

        //split the id to arr
        const listIdArr = listId.split("-");
        //get the actual id
        const id = parseInt(listIdArr[1]);

        const itemToDelete = uiCtrl.deleteListItem(id);
        //set curr item
        itemCtrl.deleteItem(itemToDelete);

        itemCtrl.setCurrentItem();

        // //get total calories
        const totalCalories = itemCtrl.getTotalCalories();
        // //add total calories to ui
        uiCtrl.showTotalCalories(totalCalories);

        //delete item from the local storage
        storageCtrl.deleteItemFromLocalStorage(id);

        uiCtrl.clearEditState();
      }
     e.preventDefault();
  }

  //clear all items event
  const clearAllClick = function() {
    //delete all item from data structure
    itemCtrl.clearAllItems();

    //get total calories
    const totalCalories = itemCtrl.getTotalCalories();
    //add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    //clear all items in the local storage
    storageCtrl.clearAllFromLocalStorage();

    //remove all from ui
    uiCtrl.removeItems();

    uiCtrl.hideList();
  }

    //public methods
    return {
        init: function() {
            //clear edit state / set initial settings
            uiCtrl.clearEditState();

           //init and fetch items
            const items = itemCtrl.getItems();
            //check if theres any items
            if (items.length === 0 ){
                uiCtrl.hideList
            } else {
                //populate list with items
                uiCtrl.populateItemList(items)
            }

            //get total cal
            const totalCalories = itemCtrl.getTotalCalories();
            //display total cal to ui
            uiCtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListeners();
        }
    }
})(itemCtrl, storageCtrl, uiCtrl)

appCtrl.init();