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
    deleteFile(state, action) {
      const index = state.files.findIndex((f) => f.id === action.payload);
      state.files.splice(index, 1);
    },
    clearFiles(state) {
      state.files = [];
    },
  },
});

export const { setUser, clearUser, setFiles, addFile, deleteFile, clearFiles } = userSlice.actions;
export default userSlice.reducer;
