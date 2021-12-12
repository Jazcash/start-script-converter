"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptConverter = void 0;
class ScriptConverter {
    parseScript(scriptStr) {
        let obj = this.scriptToObject(scriptStr).game;
        obj = this.coerceTypes(obj);
        obj = this.parseGroups(obj);
        return obj;
    }
    generateScript(script) {
        let scriptObj = JSON.parse(JSON.stringify(script));
        scriptObj = this.convertGroups(scriptObj);
        const scriptStr = this.stringifyScriptObj(scriptObj);
        return `[game] {${scriptStr}\n}`;
    }
    scriptToObject(scriptStr) {
        let scriptJson = `{${scriptStr}}`;
        scriptJson = scriptJson
            .replace(/([^=\w\][])(\[(.*?)\])/gm, "$1\"$3\":")
            .replace(/^\s*(\w*)=(.*?);/gm, "\"$1\": \"$2\",")
            .replace(/\r|\n/gm, "")
            .replace(/",\s*}/gm, "\"}")
            .replace(/}"/gm, "},\"");
        try {
            const obj = JSON.parse(scriptJson);
            return obj;
        }
        catch (err) {
            console.log(scriptJson);
            console.error(err);
            throw err;
        }
    }
    coerceTypes(obj) {
        for (const key in obj) {
            const val = obj[key];
            const newKey = key.toLowerCase();
            if (typeof val === "object") {
                obj[newKey] = this.coerceTypes(val);
            }
            else {
                let newVal = Number(val);
                if (Number.isNaN(newVal) || newKey.includes("name")) {
                    newVal = val;
                }
                obj[newKey] = newVal;
            }
            if (key !== newKey) {
                delete obj[key];
            }
        }
        return obj;
    }
    parseGroups(obj) {
        const game = {};
        const allyteams = [];
        const teams = [];
        const players = [];
        const ais = [];
        for (const key in obj) {
            const val = obj[key];
            const groups = /(allyteam|team|player|ai)(\d)/i.exec(key);
            if (groups !== null) {
                const groupKey = groups[1];
                const id = groups[2];
                val.id = Number(id);
                if (groupKey === "allyteam") {
                    allyteams.push(val);
                }
                else if (groupKey === "team") {
                    teams.push(val);
                }
                else if (groupKey === "player") {
                    players.push(val);
                }
                else if (groupKey === "ai") {
                    ais.push(val);
                }
                delete obj[key];
            }
            else if (typeof val !== "object") {
                game[key] = val;
                delete obj[key];
            }
        }
        return {
            game,
            allyteams,
            teams,
            players,
            ais,
            ...obj
        };
    }
    convertGroups(scriptObj) {
        const groups = ["allyteams", "teams", "players", "ais"];
        for (const key of groups) {
            const group = scriptObj[key];
            const newKey = key.slice(0, key.length - 1);
            if (group === null || group === void 0 ? void 0 : group.length) {
                for (const entry of group) {
                    scriptObj[`${newKey}${entry.id}`] = entry;
                    delete entry.id;
                }
                delete scriptObj[key];
            }
        }
        for (const key in scriptObj.game) {
            scriptObj[key] = scriptObj.game[key];
        }
        delete scriptObj.game;
        return scriptObj;
    }
    stringifyScriptObj(obj, depth = 1) {
        let str = "";
        const spacer = " ".repeat(depth * 4);
        for (const key in obj) {
            const val = obj[key];
            if (typeof val === "object") {
                str += `\n${spacer}[${key}] {${this.stringifyScriptObj(val, depth + 1)}\n${spacer}}`;
            }
            else {
                str += `\n${spacer}${key}=${val};`;
            }
        }
        return str;
    }
}
exports.ScriptConverter = ScriptConverter;
//# sourceMappingURL=script-converter.js.map