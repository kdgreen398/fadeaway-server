interface AllowedStatusChanges {
  [key: string]: string[];
}

export const allowedStatusChanges: AllowedStatusChanges = {
  pending: ["accepted", "declined"],
  accepted: ["completed", "canceled"],
  declined: [],
  canceled: [],
  completed: [],
};
