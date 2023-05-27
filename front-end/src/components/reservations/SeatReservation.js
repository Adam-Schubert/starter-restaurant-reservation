import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../../layout/Loading";
import { readReservation, listTables, seatReservation } from "../../utils/api";
import TableOption from "../tables/TableOption";

export default function SeatReservation() {
  const [currentReservation, setCurrentReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [seatingErrors, setSeatingErrors] = useState({});

  const { reservation_id } = useParams();

  const history = useHistory();

  useEffect(loadSeating, [reservation_id]);

  function loadSeating() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setCurrentReservation)
      .catch(setReservationError);
    listTables(abortController.signal)
      .then(setAvailableTables)
      .catch(setReservationError);
    return () => abortController.abort();
  }

  const handleSelectChange = (event) => {
    event.preventDefault();
    setTableId(event.target.value);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.go(-1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSeatingErrors({});
    const ac = new AbortController();
    try {
      await seatReservation(reservation_id, tableId, ac.signal);
      history.push(`/dashboard`);
    } catch (error) {
      if (!seatingErrors[error.message]) {
        setSeatingErrors({ ...seatingErrors, [error.message]: 1 });
      }
    }
    return () => ac.abort();
  };

  const optionMap = availableTables.map((table) => (
    <TableOption key={table.table_id} table={table} />
  ));

  if (Object.keys(currentReservation).length && availableTables.length) {
    return (
      <div>
        <div className="seat seat-title row ml-1 mt-1">
          <h1>Seat Reservation</h1>
        </div>
        <div className="seat seat-information row ml-1 mb-3">
          <h3>
            #{currentReservation.reservation_id} -{" "}
            {currentReservation.first_name} {currentReservation.last_name} on{" "}
            {currentReservation.reservation_date.split("T")[0]} at{" "}
            {currentReservation.reservation_time} for{" "}
            {currentReservation.people}
          </h3>
        </div>
        <div className="seat seat-form form-group row ml-1 mb-3">
          <label htmlFor="table_id">Seat at:</label>
          <select
            name="table_id"
            id="table_id"
            className="form-control"
            onChange={handleSelectChange}
            value={tableId}
          >
            <option value="">Select An Option</option>
            {optionMap}
          </select>
        </div>
        <div className="seat seat-options row ml-1">
          <div>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          <div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
             
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading error={reservationError} />;
  }
}