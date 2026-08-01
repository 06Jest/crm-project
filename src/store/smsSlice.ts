import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  CreateSms,
  SmsState,
  UpdateSmsStatus,
} from "../types/sms";

import {
  fetchSmsAPI,
  addSmsAPI,
  updateSmsStatusAPI,
} from "../services/smsService";


const initialState: SmsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};


export const fetchSms = createAsyncThunk(
  "sms/show-sms",
  async (_, thunkAPI) => {

    try {

      return await fetchSmsAPI();

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch SMS"
      );

    }

  }
);


export const addSms = createAsyncThunk(
  "sms/add-sms",
  async (
    sms: CreateSms,
    thunkAPI
  ) => {

    try {

      return await addSmsAPI(sms);

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );

    }

  }
);


export const updateSmsStatus = createAsyncThunk(
  "sms/update-sms-status",
  async (
    {
      id,
      sms,
    }: {
      id: string;
      sms: UpdateSmsStatus;
    },
    thunkAPI
  ) => {

    try {

      return await updateSmsStatusAPI(
        id,
        sms
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );

    }

  }
);


const smsSlice = createSlice({

  name: "sms",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {


    builder.addCase(fetchSms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });


    builder.addCase(fetchSms.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });


    builder.addCase(fetchSms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(addSms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });


    builder.addCase(addSms.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });


    builder.addCase(addSms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(updateSmsStatus.fulfilled, (state, action) => {

      const index =
        state.items.findIndex(
          s => s.id === action.payload.id
        );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;

    });


    builder.addCase(updateSmsStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


  },

});


export const {
  clearError,
} = smsSlice.actions;


export default smsSlice.reducer;