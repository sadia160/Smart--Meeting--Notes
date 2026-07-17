import { reactive } from 'vue'
import { api } from '../api'

const state = reactive({
  meetings: [],
  loaded: false,
})

function upsert(meeting) {
  const idx = state.meetings.findIndex((m) => m.id === meeting.id)
  if (idx === -1) state.meetings.unshift(meeting)
  else state.meetings[idx] = meeting
}

export function useMeetings() {
  async function fetchMeetings() {
    state.meetings = await api.getMeetings()
    state.loaded = true
  }

  async function addMeeting(meeting) {
    const created = await api.createMeeting(meeting)
    state.meetings.unshift(created)
    return created.id
  }

  function getMeeting(id) {
    return state.meetings.find((m) => m.id === String(id))
  }

  async function toggleAction(meetingId, index) {
    const updated = await api.toggleAction(meetingId, index)
    upsert(updated)
  }

  async function markProcessed(id, payload) {
    const updated = await api.updateMeeting(id, { ...payload, status: 'Processed' })
    upsert(updated)
  }

  function clear() {
    state.meetings = []
    state.loaded = false
  }

  return { state, fetchMeetings, addMeeting, getMeeting, toggleAction, markProcessed, clear }
}
