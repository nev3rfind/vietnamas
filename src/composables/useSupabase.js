import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Wedding invitation API functions
export const useWeddingAPI = () => {
  
  // Get guest invitation by GUID
  const getGuestInvitation = async (inviteGuid) => {
    try {
      const { data, error } = await supabase
        .from('guest_invitations')
        .select(`
          *,
          countries (
            country_code,
            country_name_en,
            country_name_lt
          ),
          invitation_status (
            status_name
          ),
          guest_responses (
            days_in_vietnam,
            flight_ticket_date,
            days_before_wedding,
            coming_with,
            submitted_at
          )
        `)
        .eq('invite_guid', inviteGuid)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching guest invitation:', error)
      return { data: null, error }
    }
  }

  // Update guest invitation status
  const updateGuestStatus = async (inviteGuid, statusName) => {
    try {
      // First get the status ID
      const { data: statusData, error: statusError } = await supabase
        .from('invitation_status')
        .select('id')
        .eq('status_name', statusName)
        .single()

      if (statusError) throw statusError

      // Update guest invitation
      const { data, error } = await supabase
        .from('guest_invitations')
        .update({ 
          status_id: statusData.id,
          updated_at: new Date().toISOString()
        })
        .eq('invite_guid', inviteGuid)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating guest status:', error)
      return { data: null, error }
    }
  }

  // Submit guest response
  const submitGuestResponse = async (guestId, responseData) => {
    try {
      const { data, error } = await supabase
        .from('guest_responses')
        .upsert({
          guest_id: guestId,
          days_in_vietnam: responseData.daysInVietnam,
          flight_ticket_date: responseData.flightTicketDate,
          days_before_wedding: responseData.daysBeforeWedding,
          coming_with: responseData.comingWith,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error submitting guest response:', error)
      return { data: null, error }
    }
  }

  // Track guest activity
  const trackActivity = async (guestId, activityType, sessionDuration = 0, additionalData = {}) => {
    try {
      const { data, error } = await supabase
        .from('guest_activities')
        .insert({
          guest_id: guestId,
          activity_type: activityType,
          session_duration: sessionDuration,
          additional_data: additionalData,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error tracking activity:', error)
      return { data: null, error }
    }
  }

  // Get all countries
  const getCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('country_name_en')

      if (error) throw error
      return { data, error: null }
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
    getCountries
  }
}