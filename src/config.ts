import * as dotenv from "dotenv";
import { LoginCredentials } from "./interfaces";
dotenv.config();

class Config {
  static get credentials(): LoginCredentials {
    const username = process.env.SANTANDER_USERNAME;
    const password = process.env.SANTANDER_PASSWORD;

    if (!username || !password) throw new Error("Missing credentials");

    return { username, password };
  }
}

export default Config;
