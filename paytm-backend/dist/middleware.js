"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({ msg: "token is not provided" });
    }
    const token = authHeader.replace("Bearer ", "").trim();
    try {
        const decode = jsonwebtoken_1.default.verify(token, config_1.default);
        if (decode.id) {
            // @ts-ignore
            req.userId = decode.id;
            next();
        }
    }
    catch (e) {
        console.log(e);
        return res.status(403);
    }
};
exports.default = authMiddleware;
