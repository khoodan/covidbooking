import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PatientBooking } from "./Booking";
import CloseIcon from '@mui/icons-material/Close'
import { User } from "../../model/user/User";

/**
 * Props required for Modal
 */
type OnSiteBookingProps = {
  /**
   * Patient to make booking for
   */
  patient?: User,
  /**
   * Runs a function when successful
   */
  afterSuccess?: () => void;
  /**
   * Booking id of booking to edit
   */
  bookingId?: string;
} & DialogProps

/**
 * Booking Modal
 * @returns {JSX.Element}
 */
export const BookingModal: React.FC<OnSiteBookingProps> = ({ afterSuccess, patient, bookingId, ...props }) => {
  // Set modal fullscreen when screen is small
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Calls a method then closes
   */
  const afterSuccessWithClose = () => {
    afterSuccess?.()
    props.onClose?.({}, 'backdropClick')
  }

  return (
    <Dialog
      {...props}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      scroll="body"
    >
      <DialogTitle style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }} />
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => props.onClose?.({}, 'backdropClick')}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '4rem 4rem 7rem' }}>
        <PatientBooking patient={patient} afterSuccess={afterSuccessWithClose} bookingId={bookingId}/>
      </DialogContent>
    </Dialog>
  )
}