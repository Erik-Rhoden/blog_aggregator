import { readConfig, setUser } from "../config";

function main() {
  setUser("Erik");
  const config = readConfig();
  console.log(config);
}

main();
