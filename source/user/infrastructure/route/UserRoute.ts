import { Router, Request, Response } from "express";
import { MongoRepository } from "../repository/MongoRepository";
import { UserUseCase } from "../../application/UserUseCase";
import { UserController } from "../controller/UserController";
import { 
    createUserValidation, 
    updateUserValidation, 
    getUserByIdValidation, 
    deleteUserValidation 
} from "../validation/user.validation";
import { handleValidationErrors } from "../middleware/validation.middleware";
import { asyncHandler } from "../middleware/exception-handler.middleware";

const route = Router();

// Inicializar dependencias siguiendo el principio de inyección de dependencias
const mongoRepository = new MongoRepository();
const userUseCase = new UserUseCase(mongoRepository);
const userCtrl = new UserController(userUseCase);

// Definir rutas y vincular con los métodos del controlador
route.post("/register", createUserValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.registerUser(req, res)));
route.get("/", asyncHandler((req: Request, res: Response) => userCtrl.getAllUsers(req, res)));
route.get("/:uuid", getUserByIdValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.getUserById(req, res)));
route.put("/:uuid", updateUserValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.updateUser(req, res)));
route.delete("/:uuid", deleteUserValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.deleteUser(req, res)));

// Nuevas rutas adicionales
route.patch("/:uuid/last-login", getUserByIdValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.updateLastLogin(req, res)));
route.patch("/:uuid/toggle-status", getUserByIdValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.toggleUserStatus(req, res)));
route.patch("/:uuid/activate", getUserByIdValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.activateUser(req, res)));
route.patch("/:uuid/deactivate", getUserByIdValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.deactivateUser(req, res)));
route.get("/check/email/:email", asyncHandler((req: Request, res: Response) => userCtrl.checkUserExistsByEmail(req, res)));
route.get("/check/id/:uuid", getUserByIdValidation, handleValidationErrors, asyncHandler((req: Request, res: Response) => userCtrl.checkUserExistsById(req, res)));

export default route;