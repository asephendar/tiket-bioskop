// src/models/store.ts
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { rootReducer } from './reducers/rootReducer';

const store = createStore(
    rootReducer, // reducer utama yang menggabungkan semua reducers
    applyMiddleware(thunk)
);

store.subscribe(() => {
    console.log(store.getState());
})

export default store;
