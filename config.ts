import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName?: string | null;
}

export type CommandHandler =
    (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (cmdName in registry) {
        registry[cmdName](cmdName, ...args);
    } else {
        throw new Error(`Unknown command: ${cmdName}`);
    }
}

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0 || !args[0] || args[0].trim() === '') {
        throw new Error("Login requires a username. Please try again.")
    }
    setUser(args[0].trim());
    console.log(`${args[0]} has been set`)
}

export function readConfig(): Config {
    const file_path = getConfigFilePath()

    if (!fs.existsSync(file_path)) {
        const defaultConfig = {
            db_url: "postgres://example",
            current_user_name: null,
        };
        fs.writeFileSync(file_path, JSON.stringify(defaultConfig, null, 2));
    }

    try {
        const read = fs.readFileSync(file_path, 'utf8')
        const rawConfig = JSON.parse(read)
        const valid_check = validateConfig(rawConfig)
        return valid_check
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in configuration file: ${file_path}`);
        } else {
            throw error;
        }
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
    if ("current_user_name" in rawConfig) {
        if (rawConfig["current_user_name"] === null || typeof rawConfig["current_user_name"] === "string") {
            config["currentUserName"] = rawConfig["current_user_name"];
        } else {
            throw new Error("The current_user_name must be a string!");
        }
    } else {
        config["currentUserName"] = null;
    }

    return config
}

function writeConfig(cfg: Config): void {
    if (cfg.currentUserName !== null && typeof cfg.currentUserName !== 'string') {
        throw new Error("The current_user_name must be a string!")
    }
    const fileConfig = {
        "db_url": cfg.dbUrl,
        "current_user_name": cfg.currentUserName
    }
    const configJSON = JSON.stringify(fileConfig)
    fs.writeFileSync(getConfigFilePath(), configJSON)
}

export function setUser(username: string): void {
    const user = readConfig()
    user.currentUserName = username
    writeConfig(user)
}