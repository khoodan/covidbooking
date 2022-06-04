import CloseIcon from '@mui/icons-material/Close'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Booking } from "../../model/booking/Booking"
import { UserType } from '../../model/user/UserType'
import { useAuthenticationPresenter } from '../../presenter/context/AuthenticationContext'
import { useBookingPresenter } from "../../presenter/context/BookingPresenterContext"

/**
 * Input form used to verify a verifiable
 * @returns {JSX.Element}
 */
export const VerifyVerifiable: React.FC = () => {
  const [verify, setVerify] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [booking, setBooking] = useState<Booking>()
  const [dialog, setDialog] = useState<boolean>(false)

  const { verifyVerifiable } = useBookingPresenter()
  const { currentUser } = useAuthenticationPresenter()

  /**
   * Finds whether the verifiable exists and for which user
   * @param e 
   */
  const verifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Reset
    setDialog(false)
    setMessage('Loading...')

    verifyVerifiable(verify)
      .then(bookingWithVerifiable => {
        // If customer, check current user is user found
        if (currentUser?.hasType(UserType.CUSTOMER)) {
          if (currentUser.getId() !== bookingWithVerifiable.getCustomer().getId()) {
            setMessage('No bookings found for this verifiable for this customer')
            return
          }
        }
        setMessage('')
        // Set
        setBooking(bookingWithVerifiable)
        setDialog(true)
      })
      .catch(err => {
        setMessage('No bookings found for this verifiable')
      })
  }

  return (
    <>
      <form onSubmit={verifySubmit} style={{ display: 'flex', flexWrap: 'nowrap', gap: '1rem' }}>
        <TextField
          fullWidth
          id="verifyInput"
          label="PIN or BookingID"
          name="verifyInput"
          autoComplete="verifyInput"
          onChange={e => setVerify(e.currentTarget.value)}
        />
        <Button variant="outlined" type="submit" onClick={() => {
        }}>Verify</Button>
      </form>
      <div style={{ marginTop: '8px' }}>{message}</div>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ display: 'flex' }}>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDialog(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Row first="Name" second={booking?.getCustomer().display()} />
          <Row first="Booking Status" second={booking?.getStatus()} />
          <Row first="Test Site" second={booking?.getTestingSite().getName()} />
          <Row first="Address" second={booking?.getTestingSite().getAddress().display} />
          <Row first="Start Time" second={booking && new Date(booking?.getStartTime()).toLocaleString()} />
          <Row first="Verifiable" second={booking && booking?.getVerifiable()?.display()} />
          <Row first="Notes" second={booking?.getNotes()} />
        </DialogContent>
      </Dialog>
    </>
  )
}

const Row: React.FC<{ first: string, second?: string }> = ({ first, second }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Typography component="h1" variant="body1">
        {first}
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <Typography component="h1" variant="body1">
        {second || ''}
      </Typography>
    </div>
  )
}