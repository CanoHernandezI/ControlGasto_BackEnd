import { Request, Response } from "express";

class IndexController{
    public index(req : Request, resp : Response){
        resp.send('Quiubole Raza!!!');
    }
}
export const indexController = new IndexController();