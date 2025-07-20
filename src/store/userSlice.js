import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  files: [],
  spaceSize: 0,
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
    setSpaceSize(state, action) {
      state.spaceSize = action.payload;
    },
    incrSpaceSize(state, action) {
      state.spaceSize += action.payload;
    },
    decrSpaceSize(state, action) {
      state.spaceSize -= action.payload;
    },
  },
});

export const { setUser, clearUser, setFiles, addFile, deleteFile, clearFiles, setSpaceSize, incrSpaceSize, decrSpaceSize } = userSlice.actions;
export default userSlice.reducer;
