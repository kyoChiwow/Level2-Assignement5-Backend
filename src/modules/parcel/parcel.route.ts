import express from 'express';
import { ParcelController } from './parcel.controller';
import { Role } from '../user/user.interface';
import { createParcelZodSchema, updateParcelStatusZodSchema } from './parcel.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';


const router = express.Router();

router.get("/", ParcelController.getAllParcels);

router.post(
  "/create",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createParcelZodSchema),
  ParcelController.createParcel
);

router.patch(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateParcelStatusZodSchema),
  ParcelController.updateParcel
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.deleteParcel
);