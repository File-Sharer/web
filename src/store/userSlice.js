import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  files: [],
  folders: [],
  spaceSize: 0,
  spaceLevel: 1,
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
    setSpaceLevel(state, action) {
      state.spaceLevel = action.payload;
    },
    setFolders(state, action) {
      state.folders = action.payload;
    },
    addFolder(state, action) {
      state.folders.push(action.payload);
    },
    deleteFolder(state, action) {
      const index = state.folders.findIndex((f) => f.id === action.payload);
      state.folders.splice(index, 1);
    },
    clearFolders(state) {
      state.folders = [];
    },
  },
});

export const { 
  setUser,
  clearUser,
  setFiles,
  addFile,
  deleteFile,
  clearFiles,
  setFolders,
  addFolder,
  deleteFolder,
  clearFolders,
  setSpaceSize,
  incrSpaceSize,
  decrSpaceSize,
  setSpaceLevel } = userSlice.actions;
export default userSlice.reducer;
