import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { Booking } from "../../model/booking/Booking";
import { BookingStatus } from "../../model/booking/BookingStatus";
import { TestSite } from "../../model/location/TestSite";
import { UserType } from "../../model/user/UserType";
import { VerifiableType } from "../../model/verification/VerifiableType";
import { useAuthenticationPresenter } from "../../presenter/context/AuthenticationContext";
import { useBookingPresenter } from "../../presenter/context/BookingPresenterContext";
import { GiveRatTestButton } from "../Patients/GiveRatTestButton";
import { BookingModal } from "../Booking/BookingModal"
import { User } from '../../model/user/User';

/**
 * Displays bookings
 */
export const BookingTable: React.FC<{ bookings?: Booking[], TestStatus?: React.FC<{ booking: Booking, testSite?: TestSite }>, patient?: User }> = ({ bookings, TestStatus, patient }) => {
  const { cancelBooking, deleteBooking } = useBookingPresenter()
  const { currentUser } = useAuthenticationPresenter()
  
  const [bookingModal, setBookingModalOpen] = useState<boolean>(false)
  const [bookingId, setBookingId] = useState<string>()

  // Clear booking id when booking modal is closed
  useEffect(() => {
    if (!bookingModal) setBookingId(undefined)

  }, [bookingModal])

  const editBooking = (booking: Booking) => {
    setBookingId(booking.getId())
    // Open modal
    setBookingModalOpen(true)
  }

  // Build components for user
  const bookingRows = bookings?.map(
    (booking, i) => {
      const bookingSite = booking.getTestingSite()
      const verifiable = booking.getVerifiable();

      // PCR test
      const tests = booking.getCovidTests()

      return (
        <TableRow
          key={i}
          sx={{ '&:last-child td, &:last-child th': { border: 0 }, hover: { cursor: 'pointer' } }}
        >
          <TableCell component="th" scope="row">
            {bookingSite?.getName()}
          </TableCell>
          <TableCell align="right">
            {bookingSite?.getAddress().display}
          </TableCell>
          <TableCell align="right">
            {new Date(booking.getStartTime()).toLocaleString()}
          </TableCell>
          <TableCell align="right">
            {booking.getIsHomeBooking() ? 'Home Booking' : 'On Site'}
          </TableCell>
          <TableCell align="right">
            {
              // QR or PIN
              verifiable?.type() === VerifiableType.QR ?
                <img src={verifiable?.string()} /> :
                booking.getVerifiable()?.display() || 'None'
            }
          </TableCell>
          <TableCell align="right">
            {
              // Check test status
              TestStatus ? 
              <TestStatus booking={booking} testSite={bookingSite} /> :
              <>
                { tests.length ? <div>{tests[0].getType()}: {tests[0].getResult()}</div> : <div>No test taken</div> }
                <GiveRatTestButton booking={booking} updated={() => {}} />
              </>
            }
          </TableCell>
          <TableCell align="right">
            {booking.getNotes()}
          </TableCell>          
          <TableCell align="right">          
            {
              // Allow booking to be edited if the user is a customer or receptionist, 
              // there are no associated covid tests and booking date has not lapsed
              (currentUser?.hasType(UserType.CUSTOMER) || currentUser?.hasType(UserType.RECEPTIONIST)) && !booking.getCovidTests().length && new Date(booking.getStartTime()) > new Date() && <Button variant="outlined" onClick={() => { editBooking(booking) }}>Edit</Button>
            }
          </TableCell>
          <TableCell align="right"> 
            {
              // Allow booking to be cancelled if testing has not been conducted yet and the current user is an admin or a resident
              booking.getStatus() == BookingStatus.CANCELLED ?
              BookingStatus.CANCELLED :
              (currentUser?.hasType(UserType.CUSTOMER) || currentUser?.hasType(UserType.RECEPTIONIST)) && !booking.getCovidTests().length && <Button variant="outlined" onClick={() => { cancelBooking(booking) } }>Cancel</Button>
            }
          </TableCell>
          <TableCell align="right">          
            {
              // Allow booking to be deleted if there are no associated covid tests
              (currentUser?.hasType(UserType.RECEPTIONIST)) && !booking.getCovidTests().length && <Button variant="outlined" onClick={() => { deleteBooking(booking) }}>Delete</Button>
            }
          </TableCell>
        </TableRow>
      )
    })

  return (
    <div style={{ padding: '0 1rem' }}>
      <TableContainer component={Paper} sx={{ maxHeight: '800px', margin: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Test Site</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">BookingType</TableCell>
              <TableCell align="right">Verifiable</TableCell>
              <TableCell align="right">Test Status</TableCell>
              <TableCell align="right">Notes</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // If empty, return loading row
              !bookingRows?.length &&
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{!bookingRows ? 'Loading...' : 'No Bookings Found!'}</TableCell>
              </TableRow>
            }
            {bookingRows}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal for OnSite Booking */}
      <BookingModal
        patient={patient}
        open={bookingModal}
        bookingId={bookingId}
        onClose={() => setBookingModalOpen(false)}
        afterSuccess={async () => {setTimeout(setBookingModalOpen, 1000, false)}}
      />
    </div>
  )
}