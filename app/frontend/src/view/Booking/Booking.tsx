import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import DateTimePicker from 'react-datetime-picker';
import { APIStatus } from '../../model/client/APIStatus';
import { TestSite } from "../../model/location/TestSite";
import { Person } from '../../model/user/Person';
import { User } from '../../model/user/User';
import { useBookingPresenter } from '../../presenter/context/BookingPresenterContext';
import { useTestSitePresenter } from '../../presenter/context/TestSitePresenterContext';
import { LabelSwitch } from '../LabelSwitch';
import { Booking, BookingMemento } from '../../model/booking/Booking';
import { BookingCaretaker } from '../../model/booking/BookingCaretaker';
import { TestSiteSelect } from '../TestSite/TestSiteSelect';
import { Notification } from '../../model/notification/Notification';
import { NotificationType } from '../../model/notification/NotificationType';

/**
 * Props for the OnSiteBooking
 */
type OnSiteBookingProps = {
  patient?: User;
  afterSuccess?: () => void;
  bookingId?: string;
}

/**
 * Gets date of tomorrow
 */
function getTomorrow(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1)
  return date;
}

/**
 * OnSiteTesting Component
 * Handles the OnSite Testing Functionality
 * @returns
 */
export const PatientBooking: React.FC<OnSiteBookingProps> = ({ patient, afterSuccess, bookingId }) => {
  // Data Context
  const { testSites: testSiteCollection } = useTestSitePresenter()
  const { bookings: bookingCollection, createBooking, updateBooking, editBooking: presenterEditBooking } = useBookingPresenter()

  // Form state
  const [testSite, setTestSite] = useState<TestSite>();
  const [editTestSiteIndex, setEditTestSiteIndex] = useState<number>();
  const [startTime, setStartTime] = useState<Date>(getTomorrow())
  const [homeBooking, setHomeBooking] = useState<boolean>(false)
  const [hasOwnKit, setHasOwnKit] = useState<boolean>(false)

  const [notes, setNotes] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [message, setMessage] = useState<string>('')

  const [mementos, setMementos] = useState<BookingMemento[]>();
  const [selectedMementoIndex, setSelectedMementoIndex] = useState<number>();

  useEffect(() => {
    // Clear fields when booking id is null
    if (!bookingId) {
      clearFields()
      return
    }
    // Set fields if bookingId is given
    setFieldsWithBookingData(bookingCollection?.getBookingById(bookingId)?.[0])
  }, [bookingId])

  const setFieldsWithBookingData = (booking: Booking | undefined) => {
    if (!booking) return

    // Test site
    testSiteCollection?.getTestSites().forEach((testSite, i) => {
      if (testSite.getId() === booking.getTestingSite().getId()) {
        setEditTestSiteIndex(i + 1)
        setTestSite(testSite)
        return
      }
    })

    // Start time
    setStartTime(new Date(booking.getStartTime()))
    // Notes
    setNotes(booking.getNotes())
  }

  const clearFields = () => {
    setEditTestSiteIndex(undefined)
    setStartTime(getTomorrow())
    setNotes("")
  }

  useEffect(() => {
    if (bookingId) {
      setMementos(bookingCollection?.getBookingCaretaker(bookingId).getHistory())
    }
  }, [mementos])

  /**
   * Handles the booking submission
   * @param e form submit event
   * @post 
   */
  const saveBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Verify inputs are filled
    if (!testSite || !notes) return

    // Check if editing a current booking
    if (bookingId) {
      editBooking()
      return
    }

    // Check if there is homebooking
    const additionalInfo: any = {}
    if (homeBooking) {
      additionalInfo.homeBooking = homeBooking
      additionalInfo.patientHasOwnKit = hasOwnKit
    }

    // Create booking
    await createBooking(patient as Person, testSite, startTime.toISOString(), notes)
      .then(_ => {
        afterSuccess?.()
        setMessage("Booking saved!")
      })
      .catch(err => {
        if (err.message === APIStatus.BADREQUEST) setMessage("Please fill out fields correctly")
        if (err.message === APIStatus.ERROR) setMessage("Unknown error occurred")
      })
      .finally(() => setSubmitting(false))
  }

  /**
   * Handles editting of a booking
   */
  const editBooking = async (): Promise<void> => {
    if (!testSite || !bookingId || !notes) return
    // Retrieve booking
    if (bookingCollection) {
      presenterEditBooking(bookingId, testSite, startTime)
        .then(() => {
          // Close modal
          clearFields()
          setSubmitting(false)
          afterSuccess?.()
          setMessage("Booking saved!")
        })
        .catch(() => {
          setSubmitting(false)
          setMessage("Unknown error occurred")
        })
    }
  }

  /**
   * Handles Change Event when a previously booked start time is selected
   * @param e change event
   * @post sets the test site
   */
  const oldStartTimeSelected = async (e: any) => {
    const mementoIndex = e.target.value as number
    const memento = mementos?.[mementoIndex - 1]

    if (bookingId && bookingCollection && memento) {
      // Restore booking details if booking is at a future date
      const bookingCaretaker: BookingCaretaker = bookingCollection?.getBookingCaretaker(bookingId)
      bookingCaretaker.undo(memento)
      if (new Date(memento.viewStartTime()) > new Date()) {
        const booking = bookingCollection.getBookingById(bookingId)[0]
        // Update booking
        await updateBooking(booking, bookingCaretaker)
        // Close modal
        clearFields()
        setSubmitting(false)
        afterSuccess?.()
        setMessage("Booking saved!")
      }
    }

    setSelectedMementoIndex(mementoIndex)
  }

  /**
   * Create form
   */
  return (
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }} component="form" onSubmit={saveBooking} >
        <Typography component="h1" variant="h5">
          {`Booking for ${patient?.display()}`}
        </Typography>
        {
          // Memento
          bookingId && (!!mementos?.length ? (
            <>
              <Typography component="h1" variant="h6">
                Restore Old Booking
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Booking</InputLabel>
                <Select labelId="selectStartTimeLabel" id="selectStartTime"
                  value={selectedMementoIndex || ''}
                  label="Start Time"
                  onChange={oldStartTimeSelected}
                >
                  {
                    // Set start time options
                    mementos && mementos.map((memento, i) =>
                      <MenuItem key={i} value={i + 1}>{new Date(memento.viewStartTime()).toLocaleString()}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </>
          ) : <div>No history!</div>)
        }

        <Typography component="h1" variant="h6">
          Booking Form
        </Typography>
        <TestSiteSelect setTestSite={setTestSite} selectedIndex={editTestSiteIndex} />
        <Typography component="h1" variant="h6">
          Test Date and Time
        </Typography>
        <DateTimePicker
          required
          onChange={setStartTime}
          value={startTime} />
        <TextField
          margin="normal"
          required
          fullWidth
          id="notes"
          label="Notes"
          name="notes"
          autoComplete="notes"
          autoFocus
          InputLabelProps={{ required: false }}
          value={notes}
          onChange={e => setNotes(e.currentTarget.value)}
        />
        <LabelSwitch label="Will the test be done at home?" switchy={homeBooking} setSwitch={setHomeBooking} />
        {homeBooking && <LabelSwitch label="Will the patient source their own RAT kit?" switchy={hasOwnKit} setSwitch={setHasOwnKit} />}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={submitting}
        >
          Save
        </Button>
        {message && <span>{message}</span>}
      </Box>
    </Container>
  )
}