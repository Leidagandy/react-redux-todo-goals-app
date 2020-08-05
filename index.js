// Generic Library Code: part of our state management library
// This function is going to create us a brand new store.

function createStore(reducer) {
  // The store should have 4 parts
  // 1. get the state
  // 2. listen for changes on state
  // 3. update the state

  let state; // this variable will hold the state of our entire application
  let listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener); // we want to push into the listeners array the function that is passed to subscribe when it is invoked.

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  // dispatch will update/modify the state inside our actual store

  const dispatch = (action) => {
    // it needs to receive an action will tell dispacth the specific action that occured inside our application
    state = reducer(state, action); // state will be whatever gets returned from calling todos passing it the current state and the action that occured
    // now we just modified the state, we need to loop trough the array of listeners so that any listener the user set up will be invoked
    listeners.forEach((listener) => listener()); // for each listener inside the listeners array we just invoke it
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

const ADD_TODO = "ADD_TODO"
const REMOVE_TODO = "REMOVE_TODO"
const TOGGLE_TODO = "TOGGLE_TODO"
const ADD_GOAL = "ADD_GOAL"
const REMOVE_GOAL = "REMOVE_GOAL"
// App Code specific to our app - code that the user might write to decide how state should change
// Reducer - it takes in the current state and an action and reduces that to a new state
//The reducer function wil specify how the state will change based on the action which occured in the appication
function todos(state = [], action) {
  // if the state is undefined set it to an empty array
  // based on the action that occured it needs to return us the new copy of our state
  // if statement will listen for a specific event type
  if (action.type === ADD_TODO) {
    // how do we want to modify the state based on this "ADD_TODO" event?
    // we want to take the new todo item which we can access from action.todo and concatenate that to our state
    return state.concat([action.todo]); // concat will return us a new array and so we are not modifying the state directly
  } else if (action.type === REMOVE_TODO) {
    //how do we want to update the state based on remove todo action?
    return state.filter((todo) => todo.id !== action.id); // we want to filter out a todo that has
    //   an id which is not equal to the id on the action
  } else if (action.type === TOGGLE_TODO) {
    return state.map((todo) =>
      todo.id !== action.id
        ? todo
        : Object.assign({}, todo, { complete: !todo.complete })
    ); //creates a new object and merges all properties of
    // todo apart from the complete property which is going to be the oposite of what complete currently is.
  } else {
    return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state; // returns the state that was passed into it
  }
}

function app(state = {}, action) {
  //if state is empty when it is invoke the first time set it to an empty object
  return {
    // now state will be and object instead of an array
    todos: todos(state.todos, action), // we call our todos reducer, passing it an action
    goals: goals(state.goals, action),
  };
}
// now we pass the app as our reducer in our createStore function. Now whenever dispatch is called
//we invoke our app function and the app fucntion is going to invoke our todos and the goals reducer
//those are going to return their specific portions of the state and then we return an object that has
// a todos properties as wel as a goals properties

const store = createStore(app); // createStore must be passed a reducer function when invoked, it returns a store object

// when we invoke create store we want the user to be able to pass in the specific reducer function that
// is going to decide how the state should change based on the specific action that occured.

// dispatch() is called with an Action
// the reducer that was passed to createStore() is called with the current state tree and the action.This updates the state tree.
// Because the state has (potencially) changed, all listener functions that have been registered with the subscribe method are called)

//our store has 3 methods: getState, subscribe and dispatch
//lets call store.subscribe, and whenever our state changes we want to console.log the new state by calling getState

store.subscribe(() => {
  console.log("The new state is: ", store.getState());
});

//next we want do dispatch an ACTION to see how the store will change

store.dispatch({
  type: ADD_TODO,
  todo: {
    id: 0,
    name: "Learn Redux",
    complete: false,
  },
});
store.dispatch({
    type: ADD_TODO,
    todo: {
      id: 1,
      name: 'Wash the car',
      complete: false,
    }
  })
  
  store.dispatch({
    type: ADD_TODO,
    todo: {
      id: 2,
      name: 'Go to the gym',
      complete: true,
    }
  })
  
  store.dispatch({
    type: REMOVE_TODO,
    id: 1
  })
  
  store.dispatch({
    type: TOGGLE_TODO,
    id: 0
  })
  
  store.dispatch({
    type: ADD_GOAL,
    goal: {
      id: 0,
      name: 'Learn Redux'
    }
  })
  
  store.dispatch({
    type: ADD_GOAL,
    goal: {
      id: 1,
      name: 'Lose 20 pounds'
    }
  })
  
  store.dispatch({
    type: REMOVE_GOAL,
    id: 0
  })

// when we execute store.dispatch, store.subscribe will run because we updated the state
// we will see that there is a new object inside our state because that is what we specified in the reducer function
