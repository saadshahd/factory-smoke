import { listHopeSkills, loadConfig, readConfigDir } from "@moo.md/hum";

const list: { id: string; installPath: string }[] = JSON.parse(await Bun.$`claude plugin list --json`.text());
const hope = list.find((plugin) => plugin.id.startsWith("hope@"));

if (!hope) throw new Error("hope is not installed");

const loaded = loadConfig(readConfigDir(".hum"), { env: { hopeSkills: listHopeSkills(hope.installPath) } });

console.log(loaded.ok ? "config ok" : loaded.refusal.message);

if (!loaded.ok) process.exit(1);
