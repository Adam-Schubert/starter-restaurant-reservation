import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../../layout/Loading";
import { readReservation, editReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";
import Error from "./../Error";

export default function EditReservation() {
  const [errors, setErrors] = useState({});
  const [editFormData, setEditFormData] = useState({});

  const handleErrorClose = (event) => {
    const errorMessage = event.target.parentNode.parentNode.childNodes[0].innerHTML;
    delete errors[`${errorMessage}`];
    setErrors({ ...errors });
  };

  const errorMap = Object.keys(errors).map((error, index) => (
    <Error key={`error-${error}`} error={error} handleErrorClose={handleErrorClose} />
  ));

  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(loadReservation, [errors, reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then((data) => setEditFormData({...data, "reservation_date": data.reservation_date.split("T")[0]}))
      .catch((error) => setErrors({ ...errors, [error.message]: 1 }));
    return () => abortController.abort();
  }

  const handleChange = (event) => {
    event.preventDefault();
    setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.go(-1);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    setErrors({});
    editFormData.people = parseInt(editFormData.people);
    try {
      await editReservation(editFormData, ac.signal);
      history.push(`/dashboard?date=${editFormData.reservation_date}`);
    } catch (error) {
      if (!errors[error.message]) {
        setErrors({ ...errors, [error.message]: 1 });
      }
    }
    return () => ac.abort();
  };

  return (
    <>
      {Object.keys(editFormData).length ? (
        <>
          <div className="editErrors">{errorMap ? errorMap : null}</div>
          <ReservationForm
            mode={"Edit"}
            handleChange={handleChange}
            handleCancel={handleCancel}
            submitHandler={submitHandler}
            formData={editFormData}
          />
        </>
      ) : (
        <Loading error={"Waiting"} />
      )}
    </>
  );
}