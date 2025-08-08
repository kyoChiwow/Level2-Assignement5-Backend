import { Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "Requested",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  RECEIVED = "Received",
  CANCELLED = "Cancelled",
  RETURNED = "Returned",
  BLOCKED = "Blocked",
}

export interface IStatusLog {
    status: ParcelStatus;
    timestamp: Date;
    updatedBy: Types.ObjectId | null;
    location?: string;
    note?: string;
}

export interface IParcel {  
  trackingId: string;
  weight: number;
  fee: number;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  currentStatus: ParcelStatus;
  statusLog: IStatusLog[];

  isBlocked: boolean;
  isCanceled: boolean;
  isDelivered: boolean;
}
