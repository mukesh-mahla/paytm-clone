"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const middleware_1 = __importDefault(require("../middleware"));
const userRouter = express_1.default.Router();
const user = zod_1.default.object({
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = user.safeParse(req.body);
    if (!result.success) {
        return res.json({ msg: "input are incorrect" });
    }
    const { firstName, lastName, email, password } = result.data;
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const users = yield db_1.User.create({
        firstName, lastName, email, password: hashPassword
    });
    const userId = users._id;
    yield db_1.Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });
    return res.json({ msg: "signed up succesfully" });
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_1.User.findOne({ email });
    if (!user) {
        return res.json({ msg: "user not found" });
    }
    const iscompare = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (user && iscompare) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.default);
        return res.json({ msg: "signed in succesfully", token: token });
    }
}));
const updateBody = zod_1.default.object({
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
    password: zod_1.default.string().optional()
});
userRouter.put("/update", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({ msg: "wrong credential" });
    }
    // @ts-ignore
    yield db_1.User.updateOne({ _id: req.userId }, req.body);
    res.json({ msg: "updated succesfully" });
}));
userRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    const users = yield db_1.User.find({
        $or: [{
                firstName: {
                    "$regex": filter, "$options": "i"
                },
                lastName: {
                    "$regex": filter, "$options": "i"
                }
            }]
    });
    return res.json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id
        }))
    });
}));
exports.default = userRouter;
