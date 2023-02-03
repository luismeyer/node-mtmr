import { imports, identifierNames, definitions, callUnnamedLambda } from "../src/ast";

describe("imports", function () {
  it("can handle empty strings", function () {
    const result = imports("");

    expect(result).toEqual([]);
  });

  it("finds require call", function () {
    const [i] = imports('const test = require("file");');
    expect(i).toBeDefined();
  });

  it("parses node_module require call", function () {
    const [i] = imports(`
      const test = require("file");
      const a = "foobar";
      console.log(a);
    `);

    expect(i.arg).toEqual("file");
    expect(i.isJsFile).toBeFalsy();
    expect(i.isNodeModule).toBeTruthy();
    expect(i.source).toEqual('const test = require("file");');
  });

  it("parses local require call", function () {
    const [i] = imports(`
      const test = require("./file.js");
      const a = "foobar";
      console.log(a);
    `);

    expect(i.arg).toEqual("./file.js");
    expect(i.isJsFile).toBeTruthy();
    expect(i.isNodeModule).toBeFalsy();
    expect(i.source).toEqual('const test = require("./file.js");');
  });

  it("finds multiple require calls", function () {
    const [i, i2] = imports(`
      const test = require("file");
      const test2 = require("./file.js");
      console.log("foobar");
    `);

    expect(i).toBeDefined();
    expect(i.arg).toBe("file");
    expect(i.isJsFile).toBeFalsy();
    expect(i.isNodeModule).toBeTruthy();

    expect(i2).toBeDefined();
    expect(i2.arg).toBe("./file.js");
    expect(i2.isJsFile).toBeTruthy();
    expect(i2.isNodeModule).toBeFalsy();
  });
});

describe("identifiers", function () {
  it("finds 'const' statememants", function () {
    const src = `
      const constant = "blub";
    `;

    const result = identifierNames(src);

    expect(result.size).toEqual(1);
    expect(result.has("constant")).toBeTruthy();
  });

  it("finds 'function' statements", function () {
    const src = `
      function lol() {};
      lol();
    `;

    const result = identifierNames(src);

    expect(result.size).toEqual(1);
    expect(result.has("lol")).toBeTruthy();
  });
});

describe("definitions", function () {
  it("finds normal definitions", function () {
    const src = `
      const t = "test";
      const b = "test";
    `;

    const [r1, r2] = definitions(src);

    expect(r1.name).toEqual("t");
    expect(r2.node).toBeDefined();

    expect(r2.name).toEqual("b");
    expect(r2.node).toBeDefined();
  });

  it("finds destrucutres definitions", function () {
    const src = `
      const {t} = {t: "test"};
      const {b} = {b: "test"};
    `;

    const [r1, r2] = definitions(src);

    expect(r1.names).toHaveLength(1);
    expect(r1.names?.[0]).toEqual("t");
    expect(r1.node).toBeDefined();

    expect(r2.names).toHaveLength(1);
    expect(r2.names?.[0]).toEqual("b");
    expect(r2.node).toBeDefined();
  });

  it("finds array definitions", function () {
    const src = `
      const [t] = ["t"];
      const [b] = ["b"];
    `;

    const [r1, r2] = definitions(src);

    expect(r1.names).toHaveLength(1);
    expect(r1.names?.[0]).toEqual("t");
    expect(r1.node).toBeDefined();

    expect(r2.names).toHaveLength(1);
    expect(r2.names?.[0]).toEqual("b");
    expect(r2.node).toBeDefined();
  });

  it("finds function definitions", function () {
    const src = `
      function test() {};
    `;

    const [r] = definitions(src);

    expect(r.name).toEqual("test");
    expect(r.node).toBeDefined();
  });
});

describe("callUnnamedLambda", function () {
  it("works", function () {
    callUnnamedLambda({})
  })
});
