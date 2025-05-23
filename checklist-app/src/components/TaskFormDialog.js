import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const TaskFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData, // { title: '', description: '' }
  dialogTitle,
  submitButtonText = "Save",
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData, open]); // Reset form when dialog opens or initialData changes

  const handleSubmit = () => {
    if (title) { // Basic validation: title is required
      onSubmit(title, description);
      onClose(); // Close dialog after submission
    }
  };

  const handleClose = () => {
    onClose();
    // Optionally reset fields on close if not relying on useEffect for open
    // setTitle(initialData?.title || '');
    // setDescription(initialData?.description || '');
  };


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          margin="dense"
          label="Task Description (Optional)"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          startIcon={<Save />}
          disabled={!title} // Disable submit if title is empty
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;
