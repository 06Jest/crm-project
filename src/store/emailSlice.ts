import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  EmailState,
  ComposeEmail,
  UpdateDraftEmail,
} from "../types/email";

import {
  fetchEmailsAPI,
  fetchEmailByIDAPI,
  addEmailDraftAPI,
  updateEmailDraftAPI,
  sendEmailAPI,
  deleteEmailAPI,
} from "../services/emailService";


const initialState: EmailState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};



export const fetchEmails = createAsyncThunk(
  "emails/show-emails",
  async (_, thunkAPI) => {
    try {
      return await fetchEmailsAPI();

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch emails"
      );

    }
  }
);



export const fetchEmailByID = createAsyncThunk(
  "emails/show-email",
  async (
    id: string,
    thunkAPI
  ) => {

    try {

      return await fetchEmailByIDAPI(id);

    } catch(err){

      return thunkAPI.rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch email"
      );

    }
  }
);



export const addEmailDraft = createAsyncThunk(
  "emails/add-email-draft",
  async (
    email: ComposeEmail,
    thunkAPI
  ) => {

    try {

      return await addEmailDraftAPI(email);

    } catch(err){

      return thunkAPI.rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to create draft"
      );

    }
  }
);



export const updateEmailDraft = createAsyncThunk(
  "emails/update-email-draft",
  async (
    {
      id,
      email,
    }: {
      id:string;
      email:UpdateDraftEmail;
    },
    thunkAPI
  ) => {

    try {

      return await updateEmailDraftAPI(
        id,
        email
      );

    } catch(err){

      return thunkAPI.rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to update draft"
      );

    }
  }
);



export const sendEmail = createAsyncThunk(
  "emails/send-email",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await sendEmailAPI(id);

    } catch(err){

      return thunkAPI.rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to send email"
      );

    }
  }
);



export const deleteEmail = createAsyncThunk(
  "emails/delete-email",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      await deleteEmailAPI(id);

      return id;

    } catch(err){

      return thunkAPI.rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to delete email"
      );

    }
  }
);





const emailSlice = createSlice({

  name:"emails",

  initialState,


  reducers:{

    clearError(state){
      state.error = null;
    },

  },



  extraReducers:(builder)=>{


    /*
      FETCH EMAILS
    */

    builder

    .addCase(fetchEmails.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchEmails.fulfilled,(state,action)=>{
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    })

    .addCase(fetchEmails.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });



    /*
      FETCH EMAIL BY ID
    */

    builder

    .addCase(fetchEmailByID.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchEmailByID.fulfilled,(state,action)=>{

      const index = state.items.findIndex(
        email => email.id === action.payload.id
      );


      if(index !== -1){
        state.items[index] = action.payload;
      }
      else{
        state.items.push(action.payload);
      }


      state.loading = false;

    })

    .addCase(fetchEmailByID.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });





    /*
      ADD DRAFT
    */

    builder

    .addCase(addEmailDraft.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })

    .addCase(addEmailDraft.fulfilled,(state,action)=>{

      state.loading = false;

      state.items.unshift(
        action.payload
      );

    })

    .addCase(addEmailDraft.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });





    /*
      UPDATE DRAFT
    */

    builder

    .addCase(updateEmailDraft.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })

    .addCase(updateEmailDraft.fulfilled,(state,action)=>{

      const index = state.items.findIndex(
        email => email.id === action.payload.id
      );


      if(index !== -1){

        state.items[index] =
          action.payload;

      }


      state.loading = false;

    })

    .addCase(updateEmailDraft.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });





    /*
      SEND EMAIL
    */

    builder

    .addCase(sendEmail.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })

    .addCase(sendEmail.fulfilled,(state,action)=>{

      const index = state.items.findIndex(
        email => email.id === action.payload.id
      );


      if(index !== -1){

        state.items[index] =
          action.payload;

      }
      else{

        state.items.unshift(
          action.payload
        );

      }


      state.loading = false;

    })

    .addCase(sendEmail.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });





    /*
      DELETE EMAIL
    */

    builder

    .addCase(deleteEmail.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })

    .addCase(deleteEmail.fulfilled,(state,action)=>{

      state.items =
        state.items.filter(
          email => email.id !== action.payload
        );


      state.loading = false;

    })

    .addCase(deleteEmail.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


  }

});



export const {
  clearError
} = emailSlice.actions;



export default emailSlice.reducer;