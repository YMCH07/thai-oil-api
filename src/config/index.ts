import * as dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  PORT: process.env.PORT || 4050,
};

export default CONFIG;
