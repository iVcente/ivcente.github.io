import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
    it("parses string fields", () => {
        const { data, content } = parseFrontmatter(
            `---\ntitle: "Hello"\ndate: "2026-01-02"\n---\n# Body\n`,
        );
        expect(data.title).toBe("Hello");
        expect(data.date).toBe("2026-01-02");
        expect(content).toBe("# Body\n");
    });

    it("parses array fields", () => {
        const { data } = parseFrontmatter(`---\ntags: ["a", "b", "c"]\n---\nbody`);
        expect(data.tags).toEqual(["a", "b", "c"]);
    });

    it("returns raw content when frontmatter is missing", () => {
        const { data, content } = parseFrontmatter("just body\n");
        expect(data).toEqual({});
        expect(content).toBe("just body\n");
    });

    it("handles CRLF line endings", () => {
        const { data, content } = parseFrontmatter(
            `---\r\ntitle: "Hi"\r\n---\r\nhello\r\n`,
        );
        expect(data.title).toBe("Hi");
        expect(content).toBe("hello\r\n");
    });
});
