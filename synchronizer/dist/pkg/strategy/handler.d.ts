import { Context } from "./type";
import { Request, Response } from "express";
export declare const getStrategiesHandler: (ctx: Context) => (req: Request, res: Response) => Promise<void>;
export declare const getStrategiesByNetworksHandler: (ctx: Context) => (req: Request, res: Response) => Promise<void>;
export declare const getStrategiesBalancesHandler: (ctx: Context) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
