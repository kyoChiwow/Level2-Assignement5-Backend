import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IParcel, IStatusLog, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { QueryBuilder } from '../../utils/QueryBuilder';

const createParcel = async (payload: IParcel) => {
  const initialStatusLog: IStatusLog = {
    status: ParcelStatus.REQUESTED,
    timestamp: new Date(),
    updatedBy: payload.sender,
  };

  const newParcel = await Parcel.create({
    ...payload,
    currentStatus: payload.currentStatus || ParcelStatus.REQUESTED,
    statusLog: [initialStatusLog],
    isBlocked: false,
    isCanceled: false,
    isDelivered: false,
  });

  return newParcel;
};

const getAllParcels = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const parcels = await queryBuilder
    .search(['trackingId', 'currentStatus'])
    .filter()
    .fields()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    parcels.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getMyParcels = async (userId: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Parcel.find({ sender: userId }), query);

  const parcels = await queryBuilder
    .search(['trackingId', 'currentStatus'])
    .filter()
    .fields()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    parcels.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleParcel = async (id: string) => {
  const parcel = await Parcel.findById(id)
    .populate('sender')
    .populate('receiver');

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");
  }

  return parcel;
};

const getStatusLog = async (id: string) => {
  const parcel = await Parcel.findById(id, { statusLog: 1 });
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");
  }
  return parcel.statusLog;
};

const updateParcel = async (id: string, data: Partial<IParcel>) => {
  const parcel = await Parcel.findById(id);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");

  if (data.currentStatus && data.currentStatus !== parcel.currentStatus) {
    parcel.statusLog.push({
      status: data.currentStatus,
      timestamp: new Date(),
      updatedBy: parcel.sender || null,
    });
  }

  Object.assign(parcel, data);
  await parcel.save();
  return parcel;
};

const cancelParcel = async (id: string, userId: string) => {
  const parcel = await Parcel.findById(id);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");

  // Only sender can cancel
  if (parcel.sender.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only cancel your own parcels");
  }

  // Can't cancel if dispatched or later
  const forbiddenStatuses = [
    ParcelStatus.DISPATCHED,
    ParcelStatus.IN_TRANSIT,
    ParcelStatus.DELIVERED,
    ParcelStatus.RECEIVED,
    ParcelStatus.CANCELLED,
    ParcelStatus.RETURNED,
    ParcelStatus.BLOCKED,
  ];
  if (forbiddenStatuses.includes(parcel.currentStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot cancel parcel with status ${parcel.currentStatus}`);
  }

  parcel.currentStatus = ParcelStatus.CANCELLED;
  parcel.isCanceled = true;
  parcel.statusLog.push({
    status: ParcelStatus.CANCELLED,
    timestamp: new Date(),
    updatedBy: parcel.sender,
  });

  await parcel.save();
  return parcel;
};

const deleteParcel = async (id: string) => {
  const parcel = await Parcel.findByIdAndDelete(id);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");
  return parcel;
};

export const ParcelService = {
  createParcel,
  getAllParcels,
  getMyParcels,
  getSingleParcel,
  getStatusLog,
  updateParcel,
  cancelParcel,
  deleteParcel,
};
