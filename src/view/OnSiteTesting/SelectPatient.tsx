import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { Person } from "../../model/user/Person"
import { User } from "../../model/user/User"
import { UserType } from "../../model/user/UserType"
import { useUserPresenter } from "../../presenter/context/UserPresenterContext"
import { StyledContainer } from "../StyledContainer"

/**
 * Props required to set the patient getting tested onsite
 */
type SelectPatientProps = {
  /**
   * Set the patient
   */
  setPatient(patient: User): void
}

/**
 * Component which provides information about all customers
 * @returns 
 */
export const SelectPatient: React.FC<SelectPatientProps> = ({ setPatient }) => {
  const { users } = useUserPresenter()

  /**
   * State for form
   */
  const [search, setSearch] = useState<string>('')
  const [customers, setUsers] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<User>()

  // Filter based on search given
  const filteredUsers: User[] | undefined = useMemo(() => {
    if (search.length) {
      // Trim and search via lowercase
      return customers?.filter(customer => customer.display().toLowerCase().includes(search.trim().toLowerCase()))
    }
    return customers
  }, [search, customers])

  // Get all customers
  useEffect(() => {
    const customerSet: Set<UserType> = new Set([UserType.CUSTOMER])
    setUsers(users?.getAllByType(customerSet))
  }, [users])

  const selectPatient = (userName: string) => {
    // Get user
    const retrievedUser = users?.getUserByUserName(userName) as User
    setPatient(retrievedUser)
    setSelectedUser(retrievedUser)
  }

  // Build components for user
  const customerComponents = useMemo(() => filteredUsers?.map(
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
          <Button variant="outlined" disabled={selectedUser?.getId() === customer.getId()} onClick={() => {
            selectPatient(customer.getUsername())
          }}>{selectedUser?.getId() === customer.getId() ? 'SELECTED' : 'SELECT'}</Button>
        </TableCell>
      </TableRow>
    )
  ), [filteredUsers, selectedUser])

  return (
    <>
      <StyledContainer margin="0 auto">
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
      </StyledContainer>
      <TableContainer component={Paper} sx={{ maxWidth: 1200, maxHeight: '800px', margin: 'auto', mt: '1rem' }} >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell align="right">Phone Number</TableCell>
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
    </>
  )
}