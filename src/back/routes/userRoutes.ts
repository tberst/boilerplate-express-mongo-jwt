import { Router,Request, Response, NextFunction } from "express";
import { UserController } from "../api/user";

export class UserRoutes {

    router: Router;
    public userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        // For TEST only ! In production, you should use an Identity Provider !!
        this.router.post("/register", this.userController.registerUser);
        this.router.post("/authenticate",  this.userController.authenticateUser,this.errorHandler);
    }

    private errorHandler(req: Request, res: Response, next: NextFunction) {
        console.log("ERROR");
         // failure in routroute
        return res.send({"status":"err","message":req});
    }
}