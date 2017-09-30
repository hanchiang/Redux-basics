import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { createStore, combineReducers } from 'redux';

// Action types
const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';

class App extends Component {
	constructor(props) {
		super(props);

        this.todoReducer = this.todoReducer.bind(this);
        this.filterReducer = this.filterReducer.bind(this);
	}

    // Todo action craetors
    doAddTodo(id, name) {
        return {
            type: TODO_ADD,
            todo: { id, name }
        };
    }

    doToggleTodo(id) {
        return {
            type: TODO_TOGGLE,
            todo: { id }
        }
    }

	applyAddTodo(state, action) {
		return Object.assign({}, action.todo, { completed: false });
	}

	applyToggleTodo(state, action) { 
        return state.id === action.todo.id
            ? Object.assign({}, state, { completed: !state.completed })
            : state;
	}

    todoEntityReducer(state, action) {
        switch(action.type) {
            case TODO_ADD:
                return this.applyAddTodo(state, action);
            case TODO_TOGGLE:
                return this.applyToggleTodo(state, action);
            default: return state;
        }
    }

	todoReducer(state = [], action) {
		switch(action.type) {
			case TODO_ADD:
				return [...state, this.todoEntityReducer(undefined, action)]
			case TODO_TOGGLE:
				return state.map(todo => this.todoEntityReducer(todo, action));
			default: return state;
		}
	}

    // Filter action creator
    doSetFilter(filter) {
        return {
            type: FILTER_SET,
            filter
        };
    }

    applySetFilter(state, action) {
        return action.filter;
    }

    filterReducer(state = 'NOTHING', action) {
        switch(action.type) {
            case FILTER_SET:
                return this.applySetFilter(state, action);
            default: return state;
        }
    }   

  render() {
    const initialState = {
        todoState: [],
        currentUser: null,
        filterState: 'SHOW_ALL'
    };

    // IMPT: substates of the global state object as keys, and the reducer as values
    const rootReducer = combineReducers({
        todoState: this.todoReducer,
        filterState: this.filterReducer
    });
    
    
  	const store = createStore(rootReducer, initialState);
  	console.log('Initial state:');
  	console.log(store.getState());

  	const unsubscribe = store.subscribe(() => {
  		console.log('store update, current state:');
  		console.log(store.getState());
  	});
    
    
  	store.dispatch(this.doAddTodo('0', 'learn redux'));
  	store.dispatch(this.doAddTodo('1', 'learn mobX'));
  	store.dispatch(this.doToggleTodo('0'));
    store.dispatch(this.doSetFilter('COMPLETED'));
    
    
  	unsubscribe();

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
      </div>
    );
  }
}

export default App;
