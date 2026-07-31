import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  CreateCall,
  UpdateCall,
  EndCall,
  CallsState,
} from "../types/call";

import {
  fetchCallsAPI,
  addCallAPI,
  updateCallAPI,
  startCallAPI,
  endCallAPI,
  cancelCallAPI,
  deleteCallAPI,
} from "../services/callsService";


const initialState: CallsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchCalls = createAsyncThunk(
  "calls/show-calls",
  async (_, thunkAPI) => {

    try {

      return await fetchCallsAPI();

    } catch(err) {

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch calls"
      );
    }
  }
);

export const addCall = createAsyncThunk(
  "calls/add-call",
  async (
    call: CreateCall,
    thunkAPI
  ) => {

    try {

      return await addCallAPI(call);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const updateCall = createAsyncThunk(
  "calls/update-call",
  async (
    {
      id,
      call,
    }: {
      id:string;
      call:UpdateCall;
    },
    thunkAPI
  ) => {

    try {

      return await updateCallAPI(
        id,
        call
      );

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const startCall = createAsyncThunk(
  "calls/start-call",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await startCallAPI(id);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const endCall = createAsyncThunk(
  "calls/end-call",
  async (
    {
      id,
      call,
    }: {
      id:string;
      call:EndCall;
    },
    thunkAPI
  ) => {

    try {

      return await endCallAPI(
        id,
        call
      );

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);


export const cancelCall = createAsyncThunk(
  "calls/cancel-call",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await cancelCallAPI(id);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const deleteCall = createAsyncThunk(
  "calls/delete-call",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await deleteCallAPI(id);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

const callsSlice = createSlice({

  name:"calls",

  initialState,

  reducers:{
    clearError(state){
      state.error = null;
    },
  },


  extraReducers:(builder)=>{


    builder.addCase(fetchCalls.pending,(state)=>{
      state.loading = true;
      state.error = null;
    });


    builder.addCase(fetchCalls.fulfilled,(state,action)=>{
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });


    builder.addCase(fetchCalls.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(addCall.pending,(state)=>{
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addCall.fulfilled,(state,action)=>{
      state.items.unshift(action.payload);
      state.loading = false;
    });



    builder.addCase(updateCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(startCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(endCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(cancelCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(deleteCall.fulfilled,(state,action)=>{

      state.items =
        state.items.filter(
          c => c.id !== action.payload
        );

      state.loading = false;

    });



    builder.addCase(addCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(updateCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(startCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(endCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(cancelCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(deleteCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


  }

});


export const {
  clearError
} = callsSlice.actions;


export default callsSlice.reducer;