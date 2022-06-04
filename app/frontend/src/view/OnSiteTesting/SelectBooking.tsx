import { Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Booking } from "../../model/booking/Booking"
import { BookingCollection } from "../../model/booking/BookingCollection"
import { TestSite } from "../../model/location/TestSite"
import { Person } from "../../model/user/Person"
import { User } from "../../model/user/User"
import { BookingTable } from "../Booking/BookingTable"
import { StyledContainer } from "../StyledContainer"

/**
 * Selects a booking given a patient
 * @param patient patient to get data for
 * @param setBooking function to set booking when selected
 * @returns {JSX.Element}
 */
export const SelectBooking: React.FC<{ patient?: User, setBooking: (booking: Booking | undefined) => void }> = ({ patient, setBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>()
  const [selectedBooking, setSelectedBooking] = useState<Booking>()

  /**
   * Component used to select a Booking
   * Passed to BookingTable
   * @param booking to select
   * @returns {JSX.Element}
   */
  const SelectBookingButton: React.FC<{ booking: Booking, testSite?: TestSite }> = ({ booking }) => {
    const selectBooking = () => {
      setSelectedBooking(booking)
      setBooking(booking)
    }
    const isSelected = selectedBooking?.getId() === booking.getId()
    return <Button variant="outlined" onClick={selectBooking} disabled={isSelected}>{isSelected ? 'SELECTED' : 'SELECT'}</Button>
  }

  /**
   * Set patient in bookings
   */
  useEffect(() => {
    if (!patient) return
    const person = patient as Person;
    const personBookings = new BookingCollection(person.getBookings());
    personBookings.setCustomer(person);
    setBookings(personBookings.getOnsiteTestableBookings())
  }, [patient])

  return (
    <>
      <StyledContainer margin="0 auto 1rem" padding="1rem">
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {patient?.display()}
        </Typography>
        <Typography component="h1" variant="h6" sx={{ margin: ' 0 0 1rem 0', textAlign: 'center' }}>
          Select Booking
        </Typography>
        <Typography component="h1" variant="body1" sx={{ textAlign: 'center' }}>
          Only bookings with no tests are shown
        </Typography>
      </StyledContainer>
      <BookingTable bookings={bookings} TestStatus={SelectBookingButton} />
    </>
  )
}
