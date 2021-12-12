import * as fs from "fs";

import { ScriptConverter } from "../dist";

it("script2", async () => {
    const script = await fs.promises.readFile("test/script2.txt", "utf8");

    const scriptConverter = new ScriptConverter();

    const obj = scriptConverter.parseScript(script);

    scriptConverter.generateScript(obj);
});