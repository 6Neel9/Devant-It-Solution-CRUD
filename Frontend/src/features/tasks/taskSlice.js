// src/features/tasks/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken, removeToken } from '../../utils/auth';

const API = '/api/tasks';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.status === 401) {
      removeToken();
      window.location.href = '/login';
      return thunkAPI.rejectWithValue('Unauthorized');
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return thunkAPI.rejectWithValue('Invalid response format');
    }

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData, thunkAPI) => {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(taskData),
    });

    if (res.status === 401) {
      removeToken();
      window.location.href = '/login';
      return thunkAPI.rejectWithValue('Unauthorized');
    }

    return await res.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updates }, thunkAPI) => {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updates),
    });

    if (res.status === 401) {
      removeToken();
      window.location.href = '/login';
      return thunkAPI.rejectWithValue('Unauthorized');
    }

    return await res.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, thunkAPI) => {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.status === 401) {
      removeToken();
      window.location.href = '/login';
      return thunkAPI.rejectWithValue('Unauthorized');
    }

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
