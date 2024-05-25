import { resolve } from "node:path";
import { defineNuxtModule } from "nuxt/kit";
import { fontSplit } from "@konghayao/cn-font-split";
import { existsSync } from "fs";

interface FontSplitOptions {
    fonts?: FontInfo[];
}

interface FontInfo {
    name: string;
    path: string;
}

const name = "cn-font-split";
const cacheName = name.replaceAll("/", "+");

export default defineNuxtModule<FontSplitOptions>({
    meta: {
        name,
        configKey: "splittedFonts"
    },
    defaults: {
        fonts: []
    },
    async setup(options, nuxt) {
        const {
            fonts = []
        } = options;
        for (const font of fonts) {
            const fontName = font.name.replaceAll(/\s+/g, "_");
            const dirName = `node_modules/.cache/${cacheName}/${fontName}`;
            const cssName = "index.css";

            if (!existsSync(dirName)) {
                fontSplit({
                    FontPath: font.path,
                    destFold: dirName,
                    chunkSize: 70 * 1024,
                    previewImage: void 0,
                    testHTML: false,
                    reporter: false,
                    threads: {},
                    targetType: "ttf",
                    renameOutputFont: `[hash:8][ext]`,
                    cssFileName: cssName,
                    css: {
                        fontFamily: font.name,
                        localFamily: false
                    }
                });
            }

            nuxt.options.css.push(resolve(dirName, cssName));
        }
    }
});