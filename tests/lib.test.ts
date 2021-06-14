import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { Config, initConfig } from "../src/config";
import {
  compilerOptions,
  copyLibFile,
  getInPath,
  getOutPath,
  setupOutPath,
} from "../src/lib";

describe("getOutPath", function () {
  beforeAll(function () {
    initConfig({
      outDir: "/test/",
    });

    Config.tsCompilerOptions = {
      rootDir: "root/dir/",
      outDir: "out/dir",
    };
  });

  it("removes require main", function () {
    const result = getOutPath(join(__dirname, "/foo/bar"));
    expect(result).not.toContain(__dirname);
  });

  it("removes tsconfig rootDir", function () {
    const result = getOutPath("root/dir/foo/bar");
    expect(result).not.toContain("root/dir");
  });

  it("removes tsconfig outDir", function () {
    const result = getOutPath("out/dir/foo/bar");
    expect(result).not.toContain("out/dir");
  });

  it("prepends the outDir", function () {
    const result = getOutPath("/foo/bar");
    expect(result).toEqual("/test/foo/bar");
  });

  it("handles broken paths", function () {
    const result = getOutPath("//foo///bar/");
    expect(result).toEqual("/test/foo/bar/");
  });
});

describe("getInPath", function () {
  it("checks if the outDir is configured", function () {
    const result = getInPath("test");
    expect(result).toEqual("test");
  });

  it("replaces the outDir with the srcDir", function () {
    Config.tsCompilerOptions = {
      rootDir: "user/root/dir/",
      outDir: "user/out/dir/",
    };

    const result = getInPath("user/out/dir/test/dir");
    expect(result).toEqual("user/root/dir/test/dir");
  });
});

describe("setupOutPath", function () {
  const folderPath = "/test";
  const filePath = `${folderPath}/test.txt`;

  const outFolderPath = `/tmp${folderPath}`;
  const outFilePath = `/tmp${filePath}`;

  beforeEach(function () {
    Config.outDir = "/tmp/";

    if (existsSync(outFolderPath)) {
      rmSync(outFolderPath, { recursive: true, force: true });
    }
  });

  it("clears the directory for folders", function () {
    mkdirSync(outFolderPath, { recursive: true });
    writeFileSync(outFilePath, "test");

    setupOutPath(folderPath);

    expect(existsSync(filePath)).toBeFalsy();
  });

  it("clears the directory for files", function () {
    mkdirSync(outFolderPath, { recursive: true });
    writeFileSync(outFilePath, "test");

    setupOutPath(filePath);
    expect(existsSync(outFilePath)).toBeFalsy();
  });

  it("creates the directory for folders", function () {
    setupOutPath(folderPath);

    expect(existsSync(outFolderPath)).toBeTruthy();
  });

  it("creates the directory for files", function () {
    setupOutPath(filePath);

    expect(existsSync(outFolderPath)).toBeTruthy();
  });

  it("returns the outPath", function () {
    const result = setupOutPath(filePath);

    expect(result).toEqual(outFilePath);
  });
});

describe("copyLibFile", function () {
  const inPath = "/tmp/test/in";
  const outPath = "/tmp/test/out";

  beforeAll(function () {
    initConfig({
      outDir: "/tmp/test/out",
    });

    Config.tsCompilerOptions = {
      rootDir: inPath,
    };
  });

  it("copies one file to the outDir", function () {
    const fileInPath = `${inPath}/test.txt`;
    const fileOutPath = `${outPath}/test.txt`;
    mkdirSync(inPath, { recursive: true });
    writeFileSync(fileInPath, "test");

    const out = copyLibFile(fileInPath);
    expect(out).toEqual(fileOutPath);
    expect(existsSync(fileOutPath)).toBeTruthy();
  });

  it("copies directory with multiple files to the outDir", function () {
    const dirInPath = `${inPath}/dir`;
    const dirOutPath = `${outPath}/dir`;
    mkdirSync(dirInPath, { recursive: true });
    writeFileSync(`${dirInPath}/file1.txt`, "test");
    writeFileSync(`${dirInPath}/file2.txt`, "test");

    const out = copyLibFile(dirInPath);
    expect(out).toEqual(dirOutPath);
    expect(existsSync(dirOutPath)).toBeTruthy();
    expect(existsSync(`${dirInPath}/file1.txt`)).toBeTruthy();
    expect(existsSync(`${dirInPath}/file2.txt`)).toBeTruthy();
  });
});

describe("compilerOptions", function () {
  it("parses the tsconfig", function () {
    const options = compilerOptions();

    expect(options?.outDir).toBeDefined();
    expect(options?.rootDir).toBeDefined();
  });

  it("returns absolute paths", function () {
    const options = compilerOptions();

    expect(isAbsolute(options?.outDir ?? "")).toBeTruthy();
    expect(isAbsolute(options?.rootDir ?? "")).toBeTruthy();
  });

  it("returns the correct paths", function () {
    const options = compilerOptions();

    expect(options?.outDir ?? "").toEqual(resolve(__dirname, "../lib"));
    expect(options?.rootDir ?? "").toEqual(resolve(__dirname, "../src"));
  });
});
