// src/pages/tasks/TaskList.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../../features/tasks/taskSlice';
import TaskItem from '../../components/TaskItem';
import { List, Typography, CircularProgress } from '@mui/material';

const TaskList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!Array.isArray(items) || items.length === 0) {
    return <Typography>No tasks found.</Typography>;
  }

  return (
    <List>
      {items.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </List>
  );
};

export default TaskList;
