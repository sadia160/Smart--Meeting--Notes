import mongoose from 'mongoose'

const actionItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    owner: { type: String, default: 'You' },
    done: { type: Boolean, default: false },
  },
  { _id: false }
)

const meetingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // stored as YYYY-MM-DD to match frontend format
    duration: { type: String, default: '0 min' },
    participants: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    transcript: { type: String, default: '' },
    transcriptSnippet: { type: String, default: '' },
    summary: { type: String, default: '' },
    keyPoints: { type: [String], default: [] },
    actionItems: { type: [actionItemSchema], default: [] },
    status: { type: String, enum: ['Draft', 'Processing', 'Processed'], default: 'Processing' },
  },
  { timestamps: true }
)

// Reshape a Mongo document into the exact shape the Vue frontend already expects
// (numeric-looking id via the store's Number(id) lookups, no __v/_id leaking through).
meetingSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    title: this.title,
    date: this.date,
    duration: this.duration,
    participants: this.participants,
    tags: this.tags,
    transcript: this.transcript,
    transcriptSnippet: this.transcriptSnippet,
    summary: this.summary,
    keyPoints: this.keyPoints,
    actionItems: this.actionItems,
    status: this.status,
  }
}

const Meeting = mongoose.model('Meeting', meetingSchema)
export default Meeting
