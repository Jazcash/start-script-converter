import * as fs from "fs";

import { ScriptConverter } from "../dist";

for (let i=1; i<=3; i++) {
    it(`script${i}`, async () => {
        const script = await fs.promises.readFile(`test/script${i}.txt`, "utf8");
        const jsonOutput = await fs.promises.readFile(`test/script${i}.json`, "utf8");
        const scriptOutput = await fs.promises.readFile(`test/output-script${i}.txt`, "utf8");
    
        const scriptConverter = new ScriptConverter();
    
        const obj = scriptConverter.parseScript(script);
    
        const output = scriptConverter.generateScript(obj);

        expect(JSON.stringify(obj)).toBe(JSON.stringify(JSON.parse(jsonOutput)));
        expect(output).toBe(scriptOutput);

        // await fs.promises.writeFile(`test/script${i}.json`, JSON.stringify(obj, null, 4));
        // await fs.promises.writeFile(`test/output-script${i}.txt`, output);
    });
}
