import React from "react";
import Table from "./Table";

export default function TableList({ tables }) {

  const tableMap = tables.map((table) => (
    <Table key={table.table_id} table={table} />
  ));

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Reservation #</th>
            <th scope="col">Table Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableMap}</tbody>
      </table>
    </div>
  );
}