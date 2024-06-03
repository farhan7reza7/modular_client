import { configureStore } from "@reduxjs/toolkit";

import { itemsReducer, init, dataReducer } from "./reducers";

const store = configureStore({
  reducer: {
    items: itemsReducer,
    data: dataReducer,
  },
  preloadedState: init,
});
export default store;
