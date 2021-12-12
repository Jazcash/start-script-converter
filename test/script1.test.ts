import * as fs from "fs";

import { ScriptConverter } from "../dist";

it("script1", async () => {
    const script = await fs.promises.readFile("test/script1.txt", "utf8");

    const scriptConverter = new ScriptConverter();

    const obj = scriptConverter.parseScript(script);

    scriptConverter.generateScript(obj);
});