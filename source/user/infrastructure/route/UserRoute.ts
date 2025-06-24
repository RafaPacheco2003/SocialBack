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

const route = Router();

// Inicializar dependencias siguiendo el principio de inyección de dependencias
const mongoRepository = new MongoRepository();
const userUseCase = new UserUseCase(mongoRepository);
const userCtrl = new UserController(userUseCase);

// Definir rutas y vincular con los métodos del controlador
route.post("/register", createUserValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.registerUser(req, res));
route.get("/", (req: Request, res: Response) => userCtrl.getAllUsers(req, res));
route.get("/:uuid", getUserByIdValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.getUserById(req, res));
route.put("/:uuid", updateUserValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.updateUser(req, res));
route.delete("/:uuid", deleteUserValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.deleteUser(req, res));

// Nuevas rutas adicionales
route.patch("/:uuid/last-login", getUserByIdValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.updateLastLogin(req, res));
route.patch("/:uuid/toggle-status", getUserByIdValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.toggleUserStatus(req, res));
route.get("/check/email/:email", (req: Request, res: Response) => userCtrl.checkUserExistsByEmail(req, res));
route.get("/check/id/:uuid", getUserByIdValidation, handleValidationErrors, (req: Request, res: Response) => userCtrl.checkUserExistsById(req, res));

export default route;