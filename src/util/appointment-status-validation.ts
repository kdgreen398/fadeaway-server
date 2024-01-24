interface AllowedStatusChanges {
  [key: string]: string[];
}

export const allowedStatusChanges: AllowedStatusChanges = {
  pending: ["accepted", "declined", "canceled"],
  accepted: ["completed", "canceled"],
  declined: [],
  canceled: [],
  completed: [],
};
