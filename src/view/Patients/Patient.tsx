import { Button, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Person } from "../../model/user/Person"
import { User } from "../../model/user/User"
import { useUserPresenter } from "../../presenter/context/UserPresenterContext"
import { BookingModal } from "../Booking/BookingModal"
import { BookingTable } from "../Booking/BookingTable"
import { StyledContainer } from "../StyledContainer"
import { VerifyVerifiable } from "./VerifyVerifiable"

/**
 * Displays information about the Patient
 *  Primarily Booking Information
 * @returns {JSX.Element}
 */
export const Patient: React.FC = () => {
  // Get username from params
  const { userName } = useParams()
  const { users } = useUserPresenter()

  // Get user information
  const [user, setUser] = useState<User>()
  // Information for bookings
  // const [userBookings, setUserBookings] = useState<Booking[]>()
  // Modal open closed
  const [bookingModal, setBookingModalOpen] = useState<boolean>(false)

  // Onload, get user
  useEffect(() => {
    // Get user
    getUser()

  }, [userName, users])

  /**
   * Gets User
   */
  const getUser = async () => {
    // Only go if we have a username
    if (!userName) return;

    setUser(users?.getUserByUserName(userName))
  }

  // Get bookings for user
  const userBookings = useMemo(() => {
    if (!user) return
    // We know it has CUSTOMER type so just cast
    const patient = user as Person;
    const bookings = patient.getBookings()
    // Set booking patient
    bookings.forEach(booking => booking.setCustomer(patient))
    return bookings
  }, [user])

  // No user so wait
  if (!user) return <div>Loading...</div>

  return (
    <>
      <StyledContainer>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {user.display()}
        </Typography>
        <Typography component="h1" variant="h6" sx={{ margin: ' 0 0 1rem 0', textAlign: 'center' }}>
          Patient
        </Typography>
        <VerifyVerifiable />
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            sx={{ float: 'right' }}
            variant="contained"
            onClick={() => setBookingModalOpen(true)}
          >
            Make Booking
          </Button>
        </div>
      </StyledContainer>
      <BookingTable bookings={userBookings} patient={user}/>
      {/* Modal for OnSite Booking */}
      <BookingModal
        patient={user}
        open={bookingModal}
        onClose={() => setBookingModalOpen(false)}
        afterSuccess={async () => {setTimeout(setBookingModalOpen, 1000, false)}}
      />
    </>
  )

}