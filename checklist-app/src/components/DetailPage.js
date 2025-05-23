import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  updateItem,
} from '../redux/actions';
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Paper,
  Box,
  // Grid, // Removed unused import
  CircularProgress,
  ListItemIcon,
} from '@mui/material';
import { Edit, Delete, Add, Description, Save } from '@mui/icons-material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { formatDate } from '../utils/dateUtils';
import TaskItem from './TaskItem';
import TaskFormDialog from './TaskFormDialog'; // Import TaskFormDialog

function DetailPage() {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const item = useSelector((state) => state.checklist.items[itemId]);
  const itemsLoaded = useSelector((state) => state.checklist.items !== undefined); // Check if items have been loaded

  // State for dialogs and forms
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [editedItemTitle, setEditedItemTitle] = useState('');
  const [editedItemDueDate, setEditedItemDueDate] = useState('');

  // Unified state for TaskFormDialog
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormInitialData, setTaskFormInitialData] = useState(null); // null or { title, description }
  const [taskFormMode, setTaskFormMode] = useState('add'); // 'add' or 'edit'
  const [currentEditingTaskId, setCurrentEditingTaskId] = useState(null); // To identify task being edited

  const [currentTaskForView, setCurrentTaskForView] = useState(null); // For viewing description
  const [viewDescriptionOpen, setViewDescriptionOpen] = useState(false);

  // State for delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [notFound, setNotFound] = useState(false); // State for item not found


  useEffect(() => {
    if (itemsLoaded) { // Only proceed if items are loaded
      if (item) {
        setEditedItemTitle(item.title);
        setEditedItemDueDate(item.dueDate ? item.dueDate.split('T')[0] : '');
        setNotFound(false);
      } else {
        // If items are loaded but this specific item is not found
        setNotFound(true);
      }
    }
  }, [item, itemsLoaded, itemId]); // Added itemId to dependencies

  if (!itemsLoaded && !item) { // Show loading if items haven't been fetched yet
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography>Loading item details...</Typography>
      </Container>
    );
  }

  if (notFound) { // If item is definitively not found
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h5" gutterBottom>Checklist Not Found</Typography>
        <Typography gutterBottom>The checklist item you are looking for does not exist or may have been deleted.</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Go to List Page
        </Button>
      </Container>
    );
  }
  
  if (!item && !notFound) { // Fallback for initial render before useEffect sets notFound
      return (
          <Container style={{ textAlign: 'center', marginTop: '50px' }}>
              <CircularProgress />
              <Typography>Loading item details...</Typography>
          </Container>
      );
  }


  // --- Item Edit Dialog Handlers ---
  const handleEditItemOpen = () => {
    setEditedItemTitle(item.title);
    setEditedItemDueDate(item.dueDate ? item.dueDate.split('T')[0] : '');
    setEditItemOpen(true);
  };
  const handleEditItemClose = () => setEditItemOpen(false);
  const handleEditItemSave = () => {
    if (editedItemTitle && editedItemDueDate) {
      dispatch(updateItem(itemId, editedItemTitle, editedItemDueDate));
      handleEditItemClose();
    }
  };

  // --- TaskFormDialog Handlers ---
  const openTaskForm = (mode, task = null) => {
    setTaskFormMode(mode);
    if (mode === 'edit' && task) {
      setTaskFormInitialData({ title: task.title, description: task.description || '' });
      setCurrentEditingTaskId(task.id);
    } else {
      setTaskFormInitialData({ title: '', description: '' }); // For add mode
      setCurrentEditingTaskId(null);
    }
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setTaskFormInitialData(null);
    setCurrentEditingTaskId(null);
  };

  const handleTaskFormSubmit = (title, description) => {
    if (taskFormMode === 'add') {
      dispatch(addTask(itemId, title, description));
    } else if (taskFormMode === 'edit' && currentEditingTaskId) {
      // Need to find the original task to get its 'completed' status
      const taskToUpdate = item.tasks.find(t => t.id === currentEditingTaskId);
      if (taskToUpdate) {
        dispatch(
          updateTask(
            itemId,
            currentEditingTaskId,
            title,
            description,
            taskToUpdate.completed // Preserve completed status
          )
        );
      }
    }
    // closeTaskForm(); // Dialog now closes itself on successful submit
  };


  // --- View Description Dialog Handlers ---
  const handleViewDescriptionOpen = (task) => {
    setCurrentTaskForView(task);
    setViewDescriptionOpen(true);
  };
  const handleViewDescriptionClose = () => {
    setCurrentTaskForView(null);
    setViewDescriptionOpen(false);
  };


  // --- Task Action Handlers ---
  const handleToggleTaskComplete = (taskId, currentStatus) => {
    const task = item.tasks.find(t => t.id === taskId);
    if (task) {
      dispatch(updateTask(itemId, taskId, task.title, task.description, !currentStatus));
    }
  };

  const openDeleteConfirmDialog = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmDialog = () => {
    setTaskToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteTaskConfirmed = () => {
    if (taskToDelete) {
      dispatch(deleteTask(itemId, taskToDelete));
    }
    closeDeleteConfirmDialog();
  };


  // --- Drag and Drop Handler ---
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return; // Dropped outside the list
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Dropped in the same place
    }
    dispatch(reorderTasks(itemId, source.index, destination.index));
  };
  
  // formatDate is now imported from dateUtils.js

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            {item.title}
          </Typography>
          <Tooltip title="Edit Checklist Details">
            <IconButton onClick={handleEditItemOpen} color="primary">
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Due Date: {formatDate(item.dueDate)}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
            onClick={() => openTaskForm('add')} // Use new handler
          style={{ marginTop: '20px', marginBottom: '20px' }}
        >
          Add New Task
        </Button>

        {/* Item Edit Dialog */}
        <Dialog open={editItemOpen} onClose={handleEditItemClose}>
          <DialogTitle>Edit Checklist Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Checklist Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editedItemTitle}
              onChange={(e) => setEditedItemTitle(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              margin="dense"
              label="Due Date"
              type="date"
              fullWidth
              variant="outlined"
              value={editedItemDueDate}
              onChange={(e) => setEditedItemDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditItemClose} color="inherit">Cancel</Button>
            <Button onClick={handleEditItemSave} color="primary" variant="contained" startIcon={<Save />}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Unified TaskFormDialog for Add/Edit Task */}
        <TaskFormDialog
          open={isTaskFormOpen}
          onClose={closeTaskForm}
          onSubmit={handleTaskFormSubmit}
          initialData={taskFormInitialData}
          dialogTitle={taskFormMode === 'add' ? 'Add New Task' : 'Edit Task'}
          submitButtonText={taskFormMode === 'add' ? 'Add Task' : 'Save Changes'}
        />

        {/* View Task Description Dialog */}
        <Dialog open={viewDescriptionOpen} onClose={handleViewDescriptionClose} fullWidth maxWidth="sm">
            <DialogTitle>Task Description</DialogTitle>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    {currentTaskForView?.title}
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {currentTaskForView?.description || 'No description provided.'}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                  onClick={() => { 
                    const taskToEdit = currentTaskForView;
                    handleViewDescriptionClose(); 
                    if(taskToEdit) openTaskForm('edit', taskToEdit);
                  }} 
                  color="primary" 
                  variant="outlined"
                >
                    Edit
                </Button>
                <Button onClick={handleViewDescriptionClose} color="inherit">Close</Button>
            </DialogActions>
        </Dialog>

        {/* Delete Task Confirmation Dialog */}
        <Dialog
            open={deleteConfirmOpen}
            onClose={closeDeleteConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this task? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteConfirmDialog} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleDeleteTaskConfirmed} color="secondary" variant="contained" autoFocus>
                    Delete Task
                </Button>
            </DialogActions>
        </Dialog>

        {/* Task List */}
        {item.tasks.length === 0 ? (
            <Typography style={{ marginTop: '20px', fontStyle: 'italic', textAlign: 'center' }}>No tasks yet. Add some!</Typography>
        ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`droppable-${itemId}`}>
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {item.tasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onToggleComplete={handleToggleTaskComplete}
                    onOpenDescription={handleViewDescriptionOpen} // Stays the same
                    onOpenEdit={(task) => openTaskForm('edit', task)} // Use new handler
                    onOpenDeleteConfirm={openDeleteConfirmDialog} // Stays the same
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
        )}
      </Paper>
      <Button
          variant="outlined"
          onClick={() => navigate('/')}
          style={{ marginTop: '20px' }}
        >
          Back to List
        </Button>
    </Container>
  );
}

export default DetailPage;
