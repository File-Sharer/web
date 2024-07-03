import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  files: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setFiles(state, action) {
      state.files = action.payload;
    },
    addFile(state, action) {
      state.files.push(action.payload);
    },
    clearFiles(state) {
      state.files = null;
    },
  },
});

export const { setUser, clearUser, setFiles, addFile, clearFiles } = userSlice.actions;
export default userSlice.reducer;
