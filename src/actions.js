import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

export const editing = createAction("items/editing");

export const dataFetcher = createAsyncThunk("dataFetcher", async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    if (!response.ok) {
      throw new Error("invalid data type");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
});
