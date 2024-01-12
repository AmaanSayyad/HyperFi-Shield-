import { Request, Response } from "express";
import { Context } from "./type";
export declare const getNativeTokenHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTokensHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
