import { Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { TestSite } from "../../model/location/TestSite"
import { useBookingPresenter } from "../../presenter/context/BookingPresenterContext"
import { StyledContainer } from "../StyledContainer"
import { TestSiteSelect } from "../TestSite/TestSiteSelect"

/**
 * Presents data in a line
 */
const DoubleLabel: React.FC<{
  title: string,
  info: string
}> = ({ title, info }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '5px' }}>{title}</div>
      <div>{info}</div>
    </div>
  )
}

/**
 * Notification page component
 * Shows notifications for a test site
 * @returns {JSX.Element}
 */
export const Notifications: React.FC = () => {
  const { bookings } = useBookingPresenter()

  const [testSite, setTestSite] = useState<TestSite>()

  useEffect(() => {
    if (!testSite) return
  }, [testSite])

  // Row for each notification
  const notificationContainers = useMemo(() => {
    if (!testSite) return <div />
    const notifications = testSite.getAllNotifications().getNotifications()
    if (!notifications) return <div>No notifications for this test site</div>
    return notifications.map((notification, i) => {
      const booking = notification.getBooking()
      return (
        <StyledContainer maxWidth='lg' margin="1rem auto" key={i}>
          <div style={{ marginBottom: '1rem' }}>
            <DoubleLabel title="Notification Type:" info={notification.getType()} />
            <DoubleLabel title="Booking ID:" info={notification.getBookingId()} />
            <Typography component="h2" variant="subtitle2" sx={{ margin: '8px 0 0 0' }}>
              Current Information
            </Typography>
            <DoubleLabel title="Test Site: " info={testSite.getName()} />
            <DoubleLabel title="Address: " info={testSite.getAddress().display} />
            {
              booking && <>
                <DoubleLabel title="Patient: " info={booking?.getCustomer().display()} />
                <DoubleLabel title="Start Time: " info={booking && new Date(booking?.getStartTime()).toLocaleString()} />
                <DoubleLabel title="Verifiable: " info={booking && booking?.getVerifiable()?.display() as string} />
                <DoubleLabel title="Notes: " info={booking?.getNotes()} />
              </>
            }
          </div>
        </StyledContainer>
      )
    })
  }, [testSite])


  if (!bookings) return <div />

  return (
    <>
      <StyledContainer>
        <Typography component="h1" variant="h5" sx={{ margin: ' 0 0 1rem 0', textAlign: 'center' }}>
          Notifications
        </Typography>
        <TestSiteSelect setTestSite={setTestSite} />
      </StyledContainer>
      {
        notificationContainers
      }
    </>
  )
}