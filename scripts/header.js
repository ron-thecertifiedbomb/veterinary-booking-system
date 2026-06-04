"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const targetDir = path.resolve(__dirname, "../src");
if (!fs.existsSync(targetDir)) {
    console.log(`⚠️ src folder not found: ${targetDir}`);
    process.exit(0);
}
function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (["node_modules", ".git", "dist", "generated"].includes(entry.name))
            continue;
        if (entry.isDirectory()) {
            processDir(fullPath);
        }
        else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
            const content = fs.readFileSync(fullPath, "utf8");
            const relativePath = path.relative(process.cwd(), fullPath);
            const headerComment = `// ${relativePath}`;
            if (!content.startsWith(headerComment)) {
                fs.writeFileSync(fullPath, `${headerComment}\n\n${content}`);
                console.log(`✔️ Added header to ${relativePath}`);
            }
        }
    }
}
processDir(targetDir);
//# sourceMappingURL=add-file-header-comment.js.map