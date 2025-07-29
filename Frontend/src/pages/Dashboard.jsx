import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/tasks/taskSlice';
import TaskForm from '../components/TaskForm';
import TaskList from '../features/tasks/TaskList';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Task Manager</Typography>
      <TaskForm />
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <TaskList />
    </Container>
  );
};

export default Dashboard;
