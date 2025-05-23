import {
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  REORDER_TASKS,
} from './actionTypes';

const initialState = {
  items: {}, // Store items as an object with item IDs as keys
};

const checklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            id: action.payload.id,
            title: action.payload.title,
            createdDate: action.payload.createdDate,
            dueDate: action.payload.dueDate,
            tasks: [],
          },
        },
      };
    case DELETE_ITEM:
      const { [action.payload.itemId]: deletedItem, ...remainingItems } = state.items;
      return {
        ...state,
        items: remainingItems,
      };
    case UPDATE_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            title: action.payload.title,
            dueDate: action.payload.dueDate,
          },
        },
      };
    case ADD_TASK:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            tasks: [
              ...state.items[action.payload.itemId].tasks,
              action.payload.task,
            ],
          },
        },
      };
    case UPDATE_TASK:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            tasks: state.items[action.payload.itemId].tasks.map((task) =>
              task.id === action.payload.taskId
                ? {
                    ...task,
                    title: action.payload.taskTitle,
                    description: action.payload.taskDescription,
                    completed: action.payload.completed,
                  }
                : task
            ),
          },
        },
      };
    case DELETE_TASK:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            tasks: state.items[action.payload.itemId].tasks.filter(
              (task) => task.id !== action.payload.taskId
            ),
          },
        },
      };
    case REORDER_TASKS:
      const { itemId, startIndex, endIndex } = action.payload;
      const itemToReorder = state.items[itemId];
      if (!itemToReorder) return state;

      const newTasks = Array.from(itemToReorder.tasks);
      const [removed] = newTasks.splice(startIndex, 1);
      newTasks.splice(endIndex, 0, removed);

      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: {
            ...itemToReorder,
            tasks: newTasks,
          },
        },
      };
    default:
      return state;
  }
};

export default checklistReducer;
