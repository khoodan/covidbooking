import { Booking, BookingMemento } from "./Booking";

 /**
 * Caretaker class
 * Stores the snapshots of a booking and functionality to save/restore them
 * 
 */
  export class BookingCaretaker { 
    /**
     * Initialises caretaker for booking
     * @param originator the booking class to create mementos from
     * @param history list of booking mementos
     */
    constructor(
      private originator: Booking,
      private history: BookingMemento[]
    ) {}

    /**
     * Getter for booking mementos
     * @returns {BookingMemento[]} list of booking mementos
     */
    getHistory(): BookingMemento[] {
      // Filter for bookings that have lapsed
      const lapsed_bookings = this.history.filter(bookingMemento =>  new Date(bookingMemento.viewStartTime()) < new Date());
      // Removed lapsed booking snapshots
      lapsed_bookings.forEach(lapsedBookingMemento => {
        const index = this.history.indexOf(lapsedBookingMemento)
        this.history.splice(index, 1)
      })

      return this.history
    }
  

    /**
     * Creates and saves a booking momento in order of most recent
     * (maximum 3 momentos)
     */
    save(): void {
      if (this.history.length === 3) {
        // Remove oldest snapshot
        this.history.pop()
      }
      // Insert new snapshot
      this.history.splice(0, 0, this.originator.makeSnapshot())
    }
  
    /**
     * Undos a booking momento by restoring it
     * @param memento the memento to restore
     */
    undo(memento?: BookingMemento): void {
      // Restore the most recent memento if none is given
      if (!memento) {
        // Retrieve memento
        const snapshot = this.history.shift()
        if (snapshot) return this.originator.restoreBookingSnapshot(snapshot)
        return
      }     
      
      // Otherwise restore the given memento
      const mementoIndex = this.history.indexOf(memento, 0)
      if (mementoIndex > -1) {
        // Restore memento
        this.originator.restoreBookingSnapshot(memento)
        // Remove memento from history
        this.history.splice(mementoIndex, 1)
      }
    }
  }