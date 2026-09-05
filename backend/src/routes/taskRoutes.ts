import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // every task route requires authentication

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
router.patch('/:id/complete', toggleComplete);

export default router;
