import { Router } from "express";
import { ValueController } from "../api/value";
import { AuthMiddleware } from "../middleware/auth";

export class ValueRoutes {

    router: Router;
    public valueController: ValueController = new ValueController();
    public authMiddleware: AuthMiddleware = new AuthMiddleware();

    constructor() {
        this.router = Router();
        this.routes();
    }
    routes() {
        this.router.get("/",this.authMiddleware.authenticateJWT ,  this.valueController.GetValue);
    }
}