import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// פעולה אסינכרונית לקריאה לשרת
export const fetchWorkout = createAsyncThunk(
  'workout/fetchWorkout',
  async (userProfile) => {
    const response = await fetch('http://localhost:3000/api/workout/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProfile }),
    });
    return response.json();
  }
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState: { data: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkout.pending, (state) => { state.loading = true; })
      .addCase(fetchWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWorkout.rejected, (state) => {
        state.loading = false;
        state.error = 'שגיאה ביצירת תוכנית';
      });
  },
});

export default workoutSlice.reducer;