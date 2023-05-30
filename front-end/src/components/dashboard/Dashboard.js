import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../../utils/api";
import { next, previous } from "../../utils/date-time";
import useQuery from "../../utils/useQuery";
import ErrorAlert from "./../../layout/ErrorAlert";
import ReservationList from "../../components/reservations/ReservationList";
import TableList from "../../components/tables/TableList";
import './Dashboard.css';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
 function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const dateQuery = query.get("date");
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);

  const history = useHistory();

  useEffect(loadDashboard, [date, pageDate]);

  const nextDateHandler = () => {
    setPageDate(next(pageDate));
    history.push(`/dashboard?date=${next(pageDate)}`);
  };

  const previousDateHandler = () => {
    setPageDate(previous(pageDate));
    history.push(`/dashboard?date=${previous(pageDate)}`);
  };

  const todayHandler = () => {
    setPageDate(date);
    history.push(`/dashboard?date=${date}`);
  };

  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <div className="dashboard dashboard-title row ml-1">
        <h1>Dashboard</h1>
      </div>
      <div className=" dashboard dashboard-info d-md-flex mb-3 row ml-1">
        <h4 className="mb-0">Reservations for date {pageDate}</h4>
      </div>
      <div className="dashboard dashboard-nav row ml-1 mb-4">
        <button className="btn btn-outline-dark mr-2" onClick={previousDateHandler}>
          Previous
        </button>
        <button className="btn btn-outline-dark mr-2" onClick={todayHandler}>
          Today
        </button>
        <button className="btn btn-outline-dark" onClick={nextDateHandler}>
          Next
        </button>
      </div>
      <div className="dashboard error-list row ml-1">
        <ErrorAlert error={reservationsError} />
      </div>
      <div className="dashboard table-display row mx-1">
        <div className="col scroll-me">
          <h2>Reservations</h2>
          <ReservationList reservations={reservations} />
        </div>
        <div className="col">
          <h2>Tables</h2>
          <TableList tables={tables} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
