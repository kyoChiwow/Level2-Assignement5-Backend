import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, ParcelStatus } from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>({
    status: {
        type: String,
        enum: Object.values(ParcelStatus),
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    location: {
        type: String,
    },
    note: {
        type: String,
    },
}, { _id: false });

const ParcelSchema = new Schema<IParcel>({
    trackingId: {
        type: String,
        required: true,
        unique: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pickupAddress: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    currentStatus: {
        type: String,
        enum: Object.values(ParcelStatus),
        required: true,
        default: ParcelStatus.REQUESTED,
    },
    statusLog: {
        type: [StatusLogSchema],
        default: [],
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isCanceled: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

export const Parcel = model<IParcel>("Parcel", ParcelSchema);