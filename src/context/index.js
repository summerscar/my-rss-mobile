import React, { useState } from 'react';

export const AppContext = React.createContext({});

export const AppContextProvider = ({ children }) => {
  // 修改状态
  const setData = (name, data) => {
    setState(prevState => {
      return { ...prevState, [name]: data };
    });
  };

  // 添加新的状态
  const addStore = (name, initState) => {
    setState(prevState => ({ ...prevState, [name]: initState }));
  };

  const initAppState = {
    root: { text: 'hello context'},
    user: null,
    ytbPlayer: localStorage.getItem('ytbPlayer') === 'true' || false,
    channels: [{value: 'ANNnewsCH', label: 'ANN NEWS'}, {value: 'maidigitv', label: 'MAiDiGiTV'}],
    channel: localStorage.getItem('channel') || 'ANNnewsCH',
    setData,
    addStore,
  };
  const [state, setState] = useState(initAppState);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};