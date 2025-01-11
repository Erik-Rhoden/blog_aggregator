import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName?: string;
}

function readConfig(): Config {
    try {
        const file_path = getConfigFilePath()
        const read = fs.readFileSync(file_path, 'utf8')
        const rawConfig = JSON.parse(read)
        const valid_check = validateConfig(rawConfig)
        return valid_check
    } catch (error) {
        throw error;
    }
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
    const config: Config = {} as Config
    if ("db_url" in rawConfig && typeof rawConfig["db_url"] === "string") {
        config["dbUrl"] = rawConfig["db_url"]
    } else {
        throw new Error("The url is invalid!")
    }
    if ("current_user_name" in rawConfig && typeof rawConfig["current_user_name"] === "string") {
        config["currentUserName"] = rawConfig["current_user_name"]
    }
    return config
}