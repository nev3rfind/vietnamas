// Database connection and API functions for MySQL
import { ref } from 'vue'

// Since we're using Docker with MySQL, we'll simulate the database calls
// In a real production environment, you'd connect to your MySQL database
// For now, we'll use localStorage to simulate database operations

const useDatabase = () => {
  
  // Simulate database with localStorage for development
  const initializeDatabase = () => {
    if (!localStorage.getItem('wedding_db_initialized')) {
      // Initialize sample data
      const countries = [
        { id: 1, country_code: 'LT', country_name_en: 'Lithuania', country_name_lt: 'Lietuva' },
        { id: 2, country_code: 'GB', country_name_en: 'United Kingdom', country_name_lt: 'Jungtinė Karalystė' },
        { id: 4, country_code: 'DE', country_name_en: 'Germany', country_name_lt: 'Vokietija' }
      ]
      
      const invitationStatus = [
        { id: 1, status_name: 'pending' },
        { id: 2, status_name: 'accepted' },
        { id: 3, status_name: 'rejected' }
      ]
      
      const guestInvitations = [
        {
          id: 1,
          invite_guid: '550e8400-e29b-41d4-a716-446655440001',
          guest_full_name: 'Jonas Petraitis',
          guest_call: 'Jonas',
          guest_language: 'LT',
          fly_from: 1,
          status_id: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          invite_guid: '550e8400-e29b-41d4-a716-446655440002',
          guest_full_name: 'Sarah Johnson',
          guest_call: 'Sarah',
          guest_language: 'EN',
          fly_from: 2,
          status_id: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          invite_guid: '550e8400-e29b-41d4-a716-446655440003',
          guest_full_name: 'Maria Schmidt',
          guest_call: 'Maria',
          guest_language: 'EN',
          fly_from: 4,
          status_id: 2,
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          invite_guid: '550e8400-e29b-41d4-a716-446655440004',
          guest_full_name: 'Petras Kazlauskas',
          guest_call: 'Petras',
          guest_language: 'LT',
          fly_from: 1,
          status_id: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 5,
          invite_guid: '550e8400-e29b-41d4-a716-446655440005',
          guest_full_name: 'Emma Wilson',
          guest_call: 'Emma',
          guest_language: 'EN',
          fly_from: 2,
          status_id: 1,
          created_at: new Date().toISOString()
        }
      ]
      
      localStorage.setItem('countries', JSON.stringify(countries))
      localStorage.setItem('invitation_status', JSON.stringify(invitationStatus))
      localStorage.setItem('guest_invitations', JSON.stringify(guestInvitations))
      localStorage.setItem('guest_responses', JSON.stringify([]))
      localStorage.setItem('guest_activities', JSON.stringify([]))
      localStorage.setItem('wedding_db_initialized', 'true')
    }
  }

  // Get guest invitation by GUID
  const getGuestInvitation = async (inviteGuid) => {
    try {
      initializeDatabase()
      
      const guestInvitations = JSON.parse(localStorage.getItem('guest_invitations') || '[]')
      const countries = JSON.parse(localStorage.getItem('countries') || '[]')
      const invitationStatus = JSON.parse(localStorage.getItem('invitation_status') || '[]')
      const guestResponses = JSON.parse(localStorage.getItem('guest_responses') || '[]')
      
      const guest = guestInvitations.find(g => g.invite_guid === inviteGuid)
      if (!guest) {
        return { data: null, error: 'Guest not found' }
      }
      
      // Join with related data
      const country = countries.find(c => c.id === guest.fly_from)
      const status = invitationStatus.find(s => s.id === guest.status_id)
      const response = guestResponses.find(r => r.guest_id === guest.id)
      
      const result = {
        ...guest,
        countries: country,
        invitation_status: status,
        guest_responses: response
      }
      
      return { data: result, error: null }
    } catch (error) {
      console.error('Error fetching guest invitation:', error)
      return { data: null, error }
    }
  }

  // Update guest invitation status
  const updateGuestStatus = async (inviteGuid, statusName) => {
    try {
      const guestInvitations = JSON.parse(localStorage.getItem('guest_invitations') || '[]')
      const invitationStatus = JSON.parse(localStorage.getItem('invitation_status') || '[]')
      
      const status = invitationStatus.find(s => s.status_name === statusName)
      if (!status) {
        return { data: null, error: 'Status not found' }
      }
      
      const guestIndex = guestInvitations.findIndex(g => g.invite_guid === inviteGuid)
      if (guestIndex === -1) {
        return { data: null, error: 'Guest not found' }
      }
      
      guestInvitations[guestIndex].status_id = status.id
      guestInvitations[guestIndex].updated_at = new Date().toISOString()
      
      localStorage.setItem('guest_invitations', JSON.stringify(guestInvitations))
      
      return { data: guestInvitations[guestIndex], error: null }
    } catch (error) {
      console.error('Error updating guest status:', error)
      return { data: null, error }
    }
  }

  // Submit guest response
  const submitGuestResponse = async (guestId, responseData) => {
    try {
      const guestResponses = JSON.parse(localStorage.getItem('guest_responses') || '[]')
      
      // Remove existing response if any
      const filteredResponses = guestResponses.filter(r => r.guest_id !== guestId)
      
      const newResponse = {
        id: Date.now(),
        guest_id: guestId,
        days_in_vietnam: responseData.daysInVietnam,
        flight_ticket_date: responseData.flightTicketDate,
        days_before_wedding: responseData.daysBeforeWedding,
        coming_with: responseData.comingWith,
        submitted_at: new Date().toISOString()
      }
      
      filteredResponses.push(newResponse)
      localStorage.setItem('guest_responses', JSON.stringify(filteredResponses))
      
      return { data: newResponse, error: null }
    } catch (error) {
      console.error('Error submitting guest response:', error)
      return { data: null, error }
    }
  }

  // Track guest activity
  const trackActivity = async (guestId, activityType, sessionDuration = 0, additionalData = {}) => {
    try {
      const guestActivities = JSON.parse(localStorage.getItem('guest_activities') || '[]')
      
      const newActivity = {
        id: Date.now(),
        guest_id: guestId,
        activity_type: activityType,
        session_duration: sessionDuration,
        additional_data: additionalData,
        timestamp: new Date().toISOString()
      }
      
      guestActivities.push(newActivity)
      localStorage.setItem('guest_activities', JSON.stringify(guestActivities))
      
      return { data: newActivity, error: null }
    } catch (error) {
      console.error('Error tracking activity:', error)
      return { data: null, error }
    }
  }

  // Get all countries
  const getCountries = async () => {
    try {
      initializeDatabase()
      const countries = JSON.parse(localStorage.getItem('countries') || '[]')
      return { data: countries, error: null }
    } catch (error) {
      console.error('Error fetching countries:', error)
      return { data: null, error }
    }
  }

  return {
    getGuestInvitation,
    updateGuestStatus,
    submitGuestResponse,
    trackActivity,
    getCountries,
    initializeDatabase
  }
}

export { useDatabase }