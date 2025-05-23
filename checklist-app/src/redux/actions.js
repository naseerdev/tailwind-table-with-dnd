import { v4 as uuidv4 } from 'uuid';
import {
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  REORDER_TASKS,
} from './actionTypes';

export const addItem = (title, dueDate) => ({
  type: ADD_ITEM,
  payload: {
    id: uuidv4(),
    title,
    createdDate: new Date().toISOString(),
    dueDate,
    tasks: [],
  },
});

export const deleteItem = (itemId) => ({
  type: DELETE_ITEM,
  payload: {
    itemId,
  },
});

export const updateItem = (itemId, title, dueDate) => ({
  type: UPDATE_ITEM,
  payload: {
    itemId,
    title,
    dueDate,
  },
});

export const addTask = (itemId, taskTitle, taskDescription) => ({
  type: ADD_TASK,
  payload: {
    itemId,
    task: {
      id: uuidv4(),
      title: taskTitle,
      description: taskDescription,
      completed: false,
    },
  },
});

export const updateTask = (itemId, taskId, taskTitle, taskDescription, completed) => ({
  type: UPDATE_TASK,
  payload: {
    itemId,
    taskId,
    taskTitle,
    taskDescription,
    completed,
  },
});

export const deleteTask = (itemId, taskId) => ({
  type: DELETE_TASK,
  payload: {
    itemId,
    taskId,
  },
});

export const reorderTasks = (itemId, startIndex, endIndex) => ({
  type: REORDER_TASKS,
  payload: {
    itemId,
    startIndex,
    endIndex,
  },
});
