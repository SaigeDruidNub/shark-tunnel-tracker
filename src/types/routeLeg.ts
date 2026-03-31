export interface RouteLeg {
  /** Must match a Stop.id */
  fromStopId: string;
  /** Must match a Stop.id */
  toStopId: string;
  departureTime: Date;
  arrivalTime: Date;
}
