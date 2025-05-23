import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem } from '../redux/actions';
import { formatDate } from '../utils/dateUtils'; // Import formatDate
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ListPage = () => {
  const items = useSelector((state) => Object.values(state.checklist.items)); // Get items as an array
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDueDate('');
  };

  const handleCreate = () => {
    if (title && dueDate) {
      dispatch(addItem(title, dueDate));
      handleClose();
    }
  };

  // formatDate is now imported from dateUtils.js

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px', marginBottom: '20px' }}>
        Checklist Items
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginBottom: '20px' }}>
        Create New Checklist
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Checklist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new checklist, please enter the title and due date here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined" // Changed from standard to outlined
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '16px' }} // Added margin
          />
          <TextField
            margin="dense"
            id="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined" // Changed from standard to outlined
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button> {/* Adjusted button style */}
          <Button onClick={handleCreate} color="primary" variant="contained">Create</Button> {/* Adjusted button style */}
        </DialogActions>
      </Dialog>

      {items.length === 0 ? (
        <Typography variant="subtitle1" style={{ marginTop: '20px', textAlign: 'center' }}> {/* Centered text */}
          No checklists available. Create one!
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={2} style={{ marginTop: '20px' }}> {/* Added elevation and margin */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover> {/* Added hover prop */}
                  <TableCell>
                    <Link to={`/item/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{item.title}</Link> {/* Improved link style */}
                  </TableCell>
                  <TableCell>{formatDate(item.createdDate)}</TableCell>
                  <TableCell>{formatDate(item.dueDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ListPage;
