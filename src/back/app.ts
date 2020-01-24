import express from "express";
import compression from "compression";  // compresses requests

import bodyParser from "body-parser";
import path from "path";
import exphbs from "express-handlebars";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./config/secrets";
import { UserRoutes } from "./routes/userRoutes";
import { ValueRoutes } from "./routes/valueRoutes";
import * as http from "http";
import {JwtAuthentication, Login }from "./config/passport";
import passport from "passport";


class Application {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.authentication();
        this.routes();
        this.mongo();
       
    }

    private authentication(): void{
        JwtAuthentication(passport);
        Login(passport);
        this.app.use(passport.initialize());
    }

    private config(): void {
        // Express configuration
        this.app.set("port", process.env.PORT || 3000);
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(
            express.static(path.join(__dirname, "../front"), { maxAge: 31557600000 })
        );
    }

    private mongo(): void {
        // Connect to MongoDB
        const mongoUrl = MONGODB_URI;
        mongoose.Promise = bluebird;

        mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
            () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
        ).catch(err => {
            console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
            // process.exit();
        });
    }

    private routes(): void {
        this.app.use("/api/user", new UserRoutes().router);
        this.app.use("/api/value",new ValueRoutes().router);
        //this.app.use("/api/products", new ProductRoutes().router);
    }

 
    private front(): void {
        //Frontend config
        this.app.engine("handlebars", exphbs());
        this.app.set("view engine", "handlebars");
        this.app.set("views", path.join(__dirname, "../../views"));
    }

    public useErrorHandler(errorHandler: express.ErrorRequestHandler): void {

        this.app.use(errorHandler);

    }

    public start(): http.Server {

        /**
         * Start Express server.
         */
        const server = this.app.listen(this.app.get("port"), () => {
            console.log(
                "  App is running at http://localhost:%d in %s mode",
                this.app.get("port"),
                this.app.get("env")
            );
            console.log("  Press CTRL-C to stop\n");
        });
        return server;
    }

}




// /**
//  * Primary app routes.
//  */
// app.get("/", homeController.index);
// app.get("/api/values/", valuesController.getValues);


export default Application;