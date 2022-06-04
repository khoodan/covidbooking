import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Person } from "../../model/user/Person"
import { User } from "../../model/user/User"
import { UserType } from "../../model/user/UserType"
import { useUserPresenter } from "../../presenter/context/UserPresenterContext"
import { BookingModal } from "../Booking/BookingModal"
import { StyledContainer } from "../StyledContainer"
import { VerifyVerifiable } from "./VerifyVerifiable"

/**
 * Component which provides information about all customers
 * @returns 
 */
export const Patients: React.FC = () => {
  const { users } = useUserPresenter()

  // For moving to patient
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('')
  const [customers, setCustomers] = useState<User[]>()
  // Modal open closed
  const [modalPatient, setModalPatient] = useState<User>()
  const [openModal, setOpenModal] = useState<boolean>(false)

  // Filter based on search given
  const filteredCustomers: User[] | undefined = useMemo(() => {
    if (search.length) {
      // Trim and search via lowercase
      return customers?.filter(customer => customer.display().toLowerCase().includes(search.trim().toLowerCase()))
    }
    return customers
  }, [search, customers])

  // Get all customers
  useEffect(() => {
    const customerSet: Set<UserType> = new Set([UserType.CUSTOMER])
    setCustomers(users?.getAllByType(customerSet))
  }, [users])

  // Build components for user
  const customerComponents = useMemo(() => filteredCustomers?.map(
    (customer, i) => (
      <TableRow
        key={i}
        sx={{ '&:last-child td, &:last-child th': { border: 0 }, hover: { cursor: 'pointer' } }}
      >
        <TableCell component="th" scope="row">
          {customer.display()}
        </TableCell>
        <TableCell align="right">
          {(customer as Person).getPhoneNumber()}
        </TableCell>
        <TableCell align="right">
          <Button variant="outlined" onClick={() => {
            navigate(customer.getUsername())
          }}>View Bookings</Button>
        </TableCell>
        <TableCell align="right">
          <Button variant="contained" onClick={() => {
            setModalPatient(customer)
            setOpenModal(true)
          }}>Make Booking</Button>
        </TableCell>
      </TableRow>
    )
  ), [filteredCustomers])

  return (
    <>
      <StyledContainer>
        <Typography component="h1" variant="h5" sx={{ margin: ' 0 0 1rem 0', textAlign: 'center' }}>
          Patients
        </Typography>
        <TextField
          fullWidth
          id="searchInput"
          label="Search"
          name="searchInput"
          autoComplete="searchInput"
          onChange={e => setSearch(e.currentTarget.value)}
          style={{ marginBottom: '1rem' }}
        />
        <VerifyVerifiable />
      </StyledContainer>
      <TableContainer component={Paper} sx={{ maxWidth: 1200, maxHeight: '800px', margin: 'auto', mt: '1rem' }} >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell align="right">Phone Number</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // If empty, return loading row
              !customerComponents?.length &&
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{!customerComponents ? 'Loading...' : 'No Patients Found!'}</TableCell>
              </TableRow>
            }
            {customerComponents}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal for OnSite Booking */}
      <BookingModal
        open={openModal}
        patient={modalPatient as User}
        onClose={() => setOpenModal(false)}
        afterSuccess={() => setTimeout(setOpenModal, 1000, false)}
      />
    </>
  )
}