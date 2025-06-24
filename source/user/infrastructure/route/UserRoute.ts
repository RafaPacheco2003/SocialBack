import { Router } from "express";
import { MongoRepository } from "../repository/MongoRepository";
import { UserUseCase } from "../../application/UserUseCase";
import { SendEmailService } from "../../application/service/SendEmail";
import { UserController } from "../controller/UserController";
import {
  createUserValidation,
  updateUserValidation,
  getUserByIdValidation,
  deleteUserValidation,
} from "../validation/user.validation";
import { asyncHandler } from "../middleware/exception-handler.middleware";

const route = Router();

const userController = new UserController(
  new UserUseCase(new MongoRepository(), new SendEmailService())
);

route.post(
  "/register",
  createUserValidation,
  asyncHandler(userController.registerUser)
);

route.get("/", asyncHandler(userController.getAllUsers));

route.get(
  "/:uuid",
  getUserByIdValidation,
  asyncHandler(userController.getUserById)
);

route.put(
  "/:uuid",
  updateUserValidation,
  asyncHandler(userController.updateUser)
);

route.delete(
  "/:uuid",
  deleteUserValidation,
  asyncHandler(userController.deleteUser)
);

route.patch(
  "/:uuid/last-login",
  getUserByIdValidation,
  asyncHandler(userController.updateLastLogin)
);

route.patch(
  "/:uuid/toggle-status",
  getUserByIdValidation,
  asyncHandler(userController.toggleUserStatus)
);

route.patch(
  "/:uuid/activate",
  getUserByIdValidation,
  asyncHandler(userController.activateUser)
);

route.patch(
  "/:uuid/deactivate",
  getUserByIdValidation,
  asyncHandler(userController.deactivateUser)
);

route.get(
  "/check/id/:uuid",
  getUserByIdValidation,
  asyncHandler(userController.checkUserExistsById)
);

export default route;
