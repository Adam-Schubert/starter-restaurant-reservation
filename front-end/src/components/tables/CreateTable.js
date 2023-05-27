import React, { useState } from "react";
import { createTable } from "../../utils/api";
import Error from "./../Error";
import TableForm from "./TableForm";
import { useHistory } from "react-router-dom";

export default function CreateTable() {
  const [tableErrors, setTableErrors] = useState({});
  const history = useHistory();

  const initialTableData = {
    table_name: "",
    capacity: "",
  };

  const [tableData, setTableData] = useState({ ...initialTableData });

  const handleErrorClose = (event) => {
    const errorMessage = event.target.parentNode.parentNode.childNodes[0].innerHTML;
    delete tableErrors[`${errorMessage}`];
    setTableErrors({ ...tableErrors });
  };

  const errorMap = Object.keys(tableErrors).map((error, index) => (
    <Error key={`error-${error}`} error={error} handleErrorClose={handleErrorClose} />
  ));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    tableData.capacity = parseInt(tableData.capacity);
    try {
      await createTable(tableData, ac.signal);
      setTableErrors({});
      history.push(`/dashboard`);
    } catch (error) {
      if (!tableErrors[error.message]) {
        setTableErrors({ ...tableErrors, [error.message]: 1 });
      }
    }
    return () => ac.abort();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setTableData({ ...tableData, [event.target.name]: event.target.value });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.go(-1);
  };

  return (
    <>
      <div className="createErrors">{errorMap ? errorMap : null}</div>
      <TableForm
        title={"Create"}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        tableData={tableData}
        handleCancel={handleCancel}
      />
    </>
  );
}