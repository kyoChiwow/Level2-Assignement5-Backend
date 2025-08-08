import z from "zod";

export const createParcelZodSchema = z.object({
  body: z.object({
    weight: z.number({
      required_error: 'Weight is required',
    }).positive('Weight must be a positive number'),

    fee: z.number({
      required_error: 'Fee is required',
    }).nonnegative('Fee must be zero or more'),

    receiver: z.string({
      required_error: 'Receiver ID is required',
    }).regex(/^[a-f\d]{24}$/i, 'Receiver must be a valid MongoDB ObjectId'),

    pickupAddress: z.string({
      required_error: 'Pickup address is required',
    }).min(5, 'Pickup address is too short'),

    deliveryAddress: z.string({
      required_error: 'Delivery address is required',
    }).min(5, 'Delivery address is too short'),
  }),
});

export const updateParcelStatusZodSchema = z.object({
  body: z.object({
    status: z.enum([
      'Requested',
      'Approved',
      'Dispatched',
      'In Transit',
      'Delivered',
      'Received',
      'Cancelled',
      'Returned',
      'Blocked',
    ]),
    location: z.string().optional(),
    note: z.string().optional(),
  }),
});