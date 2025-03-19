import React, { createContext, useContext, useReducer } from 'react';

const defaultValue: unknown = {};

export const StateContext = createContext<any>(defaultValue);

export const StateProvider = ({ reducer, initialState, children }: any) => {
    return (
        <StateContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    );
};
export const useStateValue = () => useContext(StateContext); 