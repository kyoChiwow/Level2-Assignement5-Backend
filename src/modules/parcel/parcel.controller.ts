/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelService } from "./parcel.service";

/**
 * Helper: decode & verify JWT from Authorization header.
 * Throws AppError(401) if missing/invalid.
 */
function getDecodedToken(req: Request): JwtPayload & { id?: string; role?: string } {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
  }
  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_ACCESS_SECRET as string;
    if (!secret) throw new Error("JWT secret not configured");
    return jwt.verify(token, secret) as JwtPayload & { id?: string; role?: string };
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }
}

/* ------------------------- Controllers ------------------------- */

/**
 * POST /parcels
 * Any authenticated user (sender) can create a parcel.
 */
const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decoded = getDecodedToken(req);
  if (!decoded.id) throw new AppError(httpStatus.BAD_REQUEST, "Invalid token payload");
  // attach sender from token
  const payload = {
    ...req.body,
    sender: decoded.id,
  };

  const result = await ParcelService.createParcel(payload);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Parcel created successfully",
    data: result,
  });
});

/**
 * GET /parcels
 * Admin-only listing (with pagination/search handled by service)
 */
const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decoded = getDecodedToken(req);
  if (!decoded.role || (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN")) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to access this resource");
  }

  const result = await ParcelService.getAllParcels(req.query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All parcels fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * GET /parcels/me
 * Returns parcels for the currently authenticated user (sender)
 */
const getMyParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decoded = getDecodedToken(req);
  if (!decoded.id) throw new AppError(httpStatus.BAD_REQUEST, "Invalid token payload");

  const result = await ParcelService.getMyParcels(decoded.id, req.query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User's parcels fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * GET /parcels/:id
 * Admin OR owner (sender) OR receiver can fetch parcel details
 */
const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const decoded = getDecodedToken(req);
  const { id } = req.params;

  const parcel = await ParcelService.getSingleParcel(id); // service throws 404 if not found

  const isAdmin = decoded.role && (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN");
  const isOwner = decoded.id && parcel.sender && parcel.sender.toString() === decoded.id;
  const isReceiver = decoded.id && parcel.receiver && parcel.receiver.toString() === decoded.id;

  if (!isAdmin && !isOwner && !isReceiver) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this parcel");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel retrieved successfully",
    data: parcel,
  });
});

/**
 * GET /parcels/:id/status-log
 * Admin OR owner OR receiver can fetch status log
 */
const getStatusLog = catchAsync(async (req: Request, res: Response) => {
  const decoded = getDecodedToken(req);
  const { id } = req.params;

  // service returns statusLog or throws 404
  const statusLog = await ParcelService.getStatusLog(id);
  // optionally we could re-check ownership by fetching the parcel,
  // but service already returns the log — to be safe we can fetch single parcel:
  const parcel = await ParcelService.getSingleParcel(id);

  const isAdmin = decoded.role && (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN");
  const isOwner = decoded.id && parcel.sender && parcel.sender.toString() === decoded.id;
  const isReceiver = decoded.id && parcel.receiver && parcel.receiver.toString() === decoded.id;

  if (!isAdmin && !isOwner && !isReceiver) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this parcel status log");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel status log retrieved successfully",
    data: statusLog,
  });
});

/**
 * PATCH /parcels/:id
 * Admin-only update (for fields like currentStatus, blocking, etc.)
 */
const updateParcel = catchAsync(async (req: Request, res: Response) => {
  const decoded = getDecodedToken(req);
  if (!decoded.role || (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN")) {
    throw new AppError(httpStatus.FORBIDDEN, "Only admins can update parcels");
  }

  const { id } = req.params;
  const result = await ParcelService.updateParcel(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel updated successfully",
    data: result,
  });
});

/**
 * PATCH /parcels/cancel/:id
 * Sender can cancel their parcel if business rules allow it
 */
const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const decoded = getDecodedToken(req);
  if (!decoded.id) throw new AppError(httpStatus.BAD_REQUEST, "Invalid token payload");

  const { id } = req.params;
  const result = await ParcelService.cancelParcel(id, decoded.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel canceled successfully",
    data: result,
  });
});

/**
 * DELETE /parcels/:id
 * Admin-only delete
 */
const deleteParcel = catchAsync(async (req: Request, res: Response) => {
  const decoded = getDecodedToken(req);
  if (!decoded.role || (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN")) {
    throw new AppError(httpStatus.FORBIDDEN, "Only admins can delete parcels");
  }

  const { id } = req.params;
  const result = await ParcelService.deleteParcel(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel deleted successfully",
    data: result,
  });
});

export const ParcelController = {
  createParcel,
  getAllParcels,
  getMyParcels,
  getSingleParcel,
  getStatusLog,
  updateParcel,
  cancelParcel,
  deleteParcel,
};
