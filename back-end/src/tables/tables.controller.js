const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");

const VALID_PROPERTIES = [
  "table_name",
  "capacity",
  "isFree",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function validCapacity(req, res, next) {
  const { data } = req.body;
  if (typeof data["capacity"] !== "number" || data["capacity"] < 1) {
    return next({
      status: 400,
      message: `capacity wrong`,
    });
  }
  next();
}

function validName(req, res, next) {
  const { data } = req.body;
  if (data["table_name"].length < 2) {
    next({
      status: 400,
      message: `table_name must be more than one letter.`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const foundReservation = await reservationService.read(reservation_id);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservation_id} Could Not Be Found.`,
    });
  }
}
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    next();
  } else {
    next({
      status: 404,
      message: `Table ${table_id} Could Not Be Found.`,
    });
  }
}
function capacityCheck(req, res, next) {
  if (res.locals.table.capacity < res.locals.reservation.people) {
    next({
      status: 400,
      message: "Table does not have enough capacity",
    });
  }
  next();
}

function occupiedCheck(req, res, next) {
  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied",
    });
  }
  next();
}

function currentlyOccupied(req, res, next) {
  if (!res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: "Table is currently not occupied",
    });
  }
  next();
}

function reservationNotSeated(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "booked") {
    return next();
  }
  return next({
    status: 400,
    message: "Reservation is already seated or finished.",
  });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: req.body.data.reservation_id,
  };
  // console.log(updatedTable);
  await service.update(updatedTable);
  const data = await service.read(updatedTable.table_id);
  // console.log(data);
  res.json({ data });
}

async function finish(req, res) {
  const table = res.locals.table;
  const data = await service.finish(table.table_id, table.reservation_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validCapacity,
    validName,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasOnlyValidProperties,
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    capacityCheck,
    occupiedCheck,
    reservationNotSeated,
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    currentlyOccupied,
    asyncErrorBoundary(finish),
  ],
};