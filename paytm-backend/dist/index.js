"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1', mainRouter_1.default);
function main() {
    mongoose_1.default.connect("mongodb+srv://mukeshmahla7014:TAdqB7YQT7p%25bKR@paytm-db.nq5fv2u.mongodb.net/").then(() => { console.log("mongo connected"); });
    app.listen(3000);
}
main();
