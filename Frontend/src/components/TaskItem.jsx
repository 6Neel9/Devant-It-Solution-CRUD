import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../features/tasks/taskSlice';
import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  TextField,
  Box,
  Button
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleToggle = () => {
    dispatch(updateTask({
      id: task._id,
      updates: {
        status: task.status === 'Pending' ? 'Completed' : 'Pending'
      }
    }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    dispatch(updateTask({
      id: task._id,
      updates: {
        title: editedTitle,
        description: editedDescription
      }
    }));
    setIsEditing(false);
  };

  return (
    <ListItem
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        border: '1px solid #ccc',
        borderRadius: '8px',
        mb: 2,
        padding: 2
      }}
    >
      <Checkbox
        checked={task.status === 'Completed'}
        onChange={handleToggle}
        sx={{ mt: 1 }}
      />

      <Box sx={{ flexGrow: 1, ml: 2 }}>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              sx={{ mb: 1 }}
            />
          </>
        ) : (
          <ListItemText
            primary={`${task.title} (${task.status})`}
            secondary={`${task.description || 'No description'} | Created: ${new Date(task.createdAt).toLocaleString()}`}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
        {isEditing ? (
          <IconButton onClick={handleSave} color="primary">
            <SaveIcon />
          </IconButton>
        ) : (
          <Button onClick={() => setIsEditing(true)} size="small" variant="outlined">
            Edit
          </Button>
        )}
        <IconButton onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default TaskItem;
