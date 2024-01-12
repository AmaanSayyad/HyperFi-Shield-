import { Request, Response } from "express";
import { Context } from "./type";
export declare const walletsHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const loginHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
