import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { TestSite } from "../../model/location/TestSite"
import { TestSiteCapability } from "../../model/location/TestSiteCapability"

/**
 * TestSiteDisplayProps
 * Defines the props for the display
 */
type TestSiteDisplayProps = {
  testSites: TestSite[] | undefined
}

/**
 * Displays test sites in a table
 * @param testSites sites to render
 * @returns {JSX.Element}
 */
export const TestSiteDisplay: React.VFC<TestSiteDisplayProps> = ({ testSites }) => {
  /**
   * Checks if it is currently between 9 and 6 (time)
   * @returns {boolean} true if between 9-6
   */
  const betweenNineSix = (): boolean => {
    const now = new Date().getHours()
    return now >= 9 && now <= 18
  }

  // Render table
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, maxHeight: 800, margin: 'auto', mt: '1rem' }} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">OnSite Booking</TableCell>
            <TableCell align="right">OnSite Testing</TableCell>
            <TableCell align="right">Open Now (9AM-6PM)</TableCell>
            <TableCell align="right">Waiting Time (minutes)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // If empty, return loading row
            !testSites?.length &&
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{!testSites ? 'Loading...' : 'No Test Sites Found'}</TableCell>
            </TableRow>
          }
          {testSites && testSites.map((site, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {site.getName()}
              </TableCell>
              <TableCell align="right">{site.getAddress().display}</TableCell>
              <TableCell align="right">{site.hasCapability(TestSiteCapability.BOOKING) ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">{site.hasCapability(TestSiteCapability.TESTING) ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">{
                // Assume that all sites are open from 9-6
                betweenNineSix() ? 'Yes' : 'No'
              }</TableCell>
              <TableCell align="right">
                {
                  // Calculate a waiting time based on number of bookings
                  site.getEstimatedWaitingTime()
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}