import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Checkbox,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Description } from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({
  task,
  index,
  onToggleComplete,
  onOpenDescription,
  onOpenEdit,
  onOpenDeleteConfirm,
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          divider
          style={{
            backgroundColor: snapshot.isDragging ? '#e0e0e0' : 'inherit',
            textDecoration: task.completed ? 'line-through' : 'none',
            ...provided.draggableProps.style,
          }}
          secondaryAction={
            <>
              <Tooltip title={task.description ? "View/Edit Description" : "Add Description"}>
                <IconButton
                  edge="end"
                  aria-label="description"
                  onClick={() => task.description ? onOpenDescription(task) : onOpenEdit(task)} // Open edit if no description
                >
                  <Description />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Task">
                <IconButton edge="end" aria-label="edit" onClick={() => onOpenEdit(task)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Task">
                <IconButton edge="end" aria-label="delete" onClick={() => onOpenDeleteConfirm(task.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          }
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={task.completed}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.id}` }}
              onClick={() => onToggleComplete(task.id, task.completed)}
            />
          </ListItemIcon>
          <ListItemText
            id={`checkbox-list-label-${task.id}`}
            primary={task.title}
            style={{ color: task.completed ? 'textSecondary' : 'inherit' }}
          />
        </ListItem>
      )}
    </Draggable>
  );
};

export default TaskItem;
