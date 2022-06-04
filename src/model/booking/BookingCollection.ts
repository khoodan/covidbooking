import { TestSiteCapability } from "../location/TestSiteCapability";
import { Person } from "../user/Person";
import { Booking } from "./Booking";
import { BookingStatus } from "./BookingStatus";
import { BookingCaretaker } from "./BookingCaretaker";

/**
 * BookingCollection
 * Keeps track of Booking instances
 */
class BookingCollection {
    /**
     * Storage for the bookings
     */
    private bookings: Booking[];
    /**
     * Storage for caretakers by booking id
     */
    private caretakers: {[key: string]: BookingCaretaker}

    /**
     * Initialise the Booking Collection
     * @param bookings to set
     */
    constructor(bookings: Booking[]) {
        this.bookings = bookings
        this.caretakers = {}
    }

    /**
     * Gets bookings from API and returns them.
     * @returns {Booking[]} promise to return a list of testsites
     */
    getBookings(): Booking[] {
        return this.bookings;
    }

    /**
     * Sets bookings into this collection
     * @param bookings to set
     */
    setBookings(bookings: Booking[]) {
        this.bookings = bookings;
    }

    /**
     * Retrieves all a booking given a verifiable
     * @param verifiable to get bookings for
     * @return {Booking[]} all the bookings for a user
     */
    getBookingByVerifiable(verifiable: string): Booking[] {
        // Filter by verifiable
        return this.bookings.filter(booking => booking.getVerifiable()?.isValid(verifiable))
    }

    /**
     * Retrieves all a booking given a booking id
     * @param bookingId to get bookings for
     * @return {Booking[]} all the bookings for a user
     */
    getBookingById(bookingId: string): Booking[] {
        // Filter by id
        return this.bookings.filter(booking => booking.getId() === bookingId)
    }

    /**
     * Gets the bookings which have no tests, are on site and are not completed/cancelled
     */
    getOnsiteTestableBookings(): Booking[] {
        return this.bookings.filter(
            booking => {
                // Filter for bookings without tests taken and that are onsite tests
                const site = booking.getTestingSite()
                const hasTest = !!booking.getCovidTests().length
                return site.hasCapability(TestSiteCapability.TESTING) && !booking.getIsHomeBooking() && !hasTest && booking.hasStatus(BookingStatus.INITIATED)
            })
    }

    /**
     * Sets customer for all bookings
     * @param {Customer} customer to set
     * @post sets customer for all bookings
     */
    setCustomer(customer: Person): void {
        this.bookings.forEach(booking => booking.setCustomer(customer))
    }

    /**
     * Sets the caretaker for a given bookings
     * @param {bookingId} booking id from which to set caretaker
     * @param {caretaker} the caretaker to set
     * @post sets caretaker for booking with booking id
     */
    setCaretaker(bookingId: string, caretaker: BookingCaretaker) {
        this.caretakers[bookingId] = caretaker
    }

    /**
     * Gets the caretaker for a particular booking specified by booking id
     * @param {bookingId} booking id to retrieve caretaker for
     * @returns {BookingCaretaker} the caretaker
     */
    getBookingCaretaker(bookingId: string): BookingCaretaker {
        return this.caretakers[bookingId]
    }
}

export { BookingCollection };
