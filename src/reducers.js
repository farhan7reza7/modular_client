import {
  createSlice,
  createEntityAdapter,
  createReducer,
} from "@reduxjs/toolkit";
import { editing, dataFetcher } from "./actions";

const items = createEntityAdapter({
  selectId: (item) => item.id,
  sortComparer: (a, b) => a.task.localeCompare(b.task),
});

export const { selectAll, selectById, selectIds, selectEntities, selectTotal } =
  items.getSelectors((state) => state.items);

export const init = {
  items: items.getInitialState({ data: [], id: null }),
  data: { loading: false, error: null, data: null },
};

const itemsSlice = createSlice({
  name: "items",
  initialState: init.items,
  reducers: {
    /*adder(state, action) {
      state.data.push(action.payload);
    },*/
    adder: items.addOne,
    updater(state, action) {
      state.id = action.payload.id;
      //state.data[action.payload.id] = action.payload;
    },
    /*editer(state, action) {
      state.data[action.payload.id] = action.payload;
    },*/
    editer: items.updateOne,

    /*deleter(state, action) {
      state.data = state.data.filter((el, index) => el.id !== action.payload);
    },*/
    deleter: items.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(editing, (state, action) => {
        state.data[action.payload.id] = action.payload;
      })
      .addMatcher(
        //(action) => action.type.endsWith("DEFAULT"),
        (action) => action.type === "DEFAULT",
        (state, action) => {
          return init.items;
        }
        //   items.removeAll
      )
      .addDefaultCase((state, action) => state);
  },
});

const dataSlice = createSlice({
  name: "data",
  initialState: init.data,
  extraReducers: (builder) => {
    builder
      .addCase(dataFetcher.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(dataFetcher.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(dataFetcher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type === "DEFAULT",
        () => {
          return init.data;
        }
      );
  },
});

export const dataReducer = dataSlice.reducer;
export const { adder, editer, deleter, updater } = itemsSlice.actions;
export const itemsReducer = itemsSlice.reducer;
