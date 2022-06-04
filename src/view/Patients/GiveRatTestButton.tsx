import { Button } from "@mui/material";
import { useState } from "react";
import { Booking } from "../../model/booking/Booking";
import { useBookingPresenter } from "../../presenter/context/BookingPresenterContext";

/**
 * Figures out whether to return a button or not
 * @returns {JSX.Element}
 */
export const GiveRatTestButton: React.FC<{ booking: Booking, updated: () => void }> = ({ booking, updated }) => {
  const [giving, setGiving] = useState<boolean>(false)
  const { provideKitForBooking } = useBookingPresenter()

  // No booking yet
  if (!booking) return null

  // Not home booking don't worry
  if (!booking.getIsHomeBooking()) return null

  // Already has a kit
  if (booking.getKitProvided() || booking.getPatientHasOwnKit()) return <div>Patient has a RAT kit</div>

  // Used when the test site people gives the customer a RAT test
  const givePatientRatKit = async () => {
    setGiving(true)

    // Update booking and send
    await provideKitForBooking(booking)
    updated()

    setGiving(false)
  }

  return (
    <Button variant="outlined" onClick={givePatientRatKit} disabled={giving}>Give RAT Kit</Button>
  )
}