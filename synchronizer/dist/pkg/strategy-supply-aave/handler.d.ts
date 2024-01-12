import { Request, Response } from "express";
import { Context } from "./type";
export declare const getDepositsHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWithdrawsHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBalancesHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
