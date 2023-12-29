const AppointmentStatuses = Object.freeze({
  PENDING: Symbol("pending"),
  ACCEPTED: Symbol("accepted"),
  DECLINED: Symbol("declined"),
  CANCELED: Symbol("canceled"),
  COMPLETED: Symbol("completed"),
});

module.exports = AppointmentStatuses;
