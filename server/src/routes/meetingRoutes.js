import express from 'express'
import {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  toggleActionItem,
  deleteMeeting,
} from '../controllers/meetingController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect) // every meeting route requires a logged-in user

router.route('/').get(getMeetings).post(createMeeting)
router.route('/:id').get(getMeeting).patch(updateMeeting).delete(deleteMeeting)
router.patch('/:id/actions/:index/toggle', toggleActionItem)

export default router
