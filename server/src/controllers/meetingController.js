import Meeting from '../models/Meeting.js'

// GET /api/meetings
export async function getMeetings(req, res, next) {
  try {
    const meetings = await Meeting.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(meetings.map((m) => m.toClient()))
  } catch (err) {
    next(err)
  }
}

// GET /api/meetings/:id
export async function getMeeting(req, res, next) {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id })
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' })
    res.json(meeting.toClient())
  } catch (err) {
    next(err)
  }
}

// POST /api/meetings
export async function createMeeting(req, res, next) {
  try {
    const {
      title,
      date,
      duration,
      participants,
      tags,
      transcript,
      transcriptSnippet,
      summary,
      keyPoints,
      actionItems,
      status,
    } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const meeting = await Meeting.create({
      user: req.user._id,
      title,
      date: date || new Date().toISOString().slice(0, 10),
      duration: duration || '0 min',
      participants: participants || [],
      tags: tags || [],
      transcript: transcript || '',
      transcriptSnippet: transcriptSnippet || '',
      summary: summary || '',
      keyPoints: keyPoints || [],
      actionItems: actionItems || [],
      status: status || 'Processed',
    })

    res.status(201).json(meeting.toClient())
  } catch (err) {
    next(err)
  }
}

// PATCH /api/meetings/:id  (generic update, used for markProcessed-style edits)
export async function updateMeeting(req, res, next) {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id })
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' })

    const allowedFields = [
      'title',
      'date',
      'duration',
      'participants',
      'tags',
      'transcript',
      'transcriptSnippet',
      'summary',
      'keyPoints',
      'actionItems',
      'status',
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) meeting[field] = req.body[field]
    })

    await meeting.save()
    res.json(meeting.toClient())
  } catch (err) {
    next(err)
  }
}

// PATCH /api/meetings/:id/actions/:index/toggle
export async function toggleActionItem(req, res, next) {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id })
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' })

    const index = Number(req.params.index)
    const item = meeting.actionItems[index]
    if (!item) return res.status(404).json({ message: 'Action item not found' })

    item.done = !item.done
    await meeting.save()
    res.json(meeting.toClient())
  } catch (err) {
    next(err)
  }
}

// DELETE /api/meetings/:id
export async function deleteMeeting(req, res, next) {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' })
    res.json({ message: 'Meeting deleted' })
  } catch (err) {
    next(err)
  }
}
