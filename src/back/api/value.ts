import { Request, Response } from "express";

export class ValueController {

    public GetValue(req: Request, res: Response) {
        res.send({key:"value"});
    }
}
