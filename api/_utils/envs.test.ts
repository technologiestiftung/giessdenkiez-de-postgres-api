/* eslint-disable jest/require-to-throw-message */
/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable jest/no-hooks */
describe("testing env values", () => {
  afterEach(() => {
    delete process.env.jwksuri;
    delete process.env.audience;
    delete process.env.issuer;
    delete process.env.user;
    delete process.env.database;
    delete process.env.password;
    delete process.env.port;
    delete process.env.MAX_LITER_AMOUNTS;
  });

  test("all values exist module does not throw (uses fallbacks)", () => {
    process.env.jwksuri = "foo";
    process.env.audience = "foo";
    process.env.issuer = "foo";

    import("./envs")
      .then((module) => {
        expect(module).toBeDefined();
        expect(() => {
          module.getEnvs();
        }).not.toThrow();
        const {
          PG_PORT,
          PG_USER,
          PG_HOST,
          PG_PASSWORD,
          PG_DATABASE,
          MAX_LITER_AMOUNTS,
        } = module.getEnvs();
        expect(PG_PORT).toBe(5432);
        expect(PG_USER).toBe("fangorn");
        expect(PG_HOST).toBe("localhost");
        expect(PG_PASSWORD).toBe("ent");
        expect(PG_DATABASE).toBe("trees");
        expect(MAX_LITER_AMOUNTS).toBe(999);
      })
      .catch((err) => {
        throw err;
      });
  });
  test("all values exist module does not throw", () => {
    process.env.jwksuri = "foo";
    process.env.audience = "foo";
    process.env.issuer = "foo";
    process.env.user = "foo";
    process.env.database = "foo";
    process.env.password = "foo";
    process.env.port = "1234";
    process.env.host = "foo";
    process.env.MAX_LITER_AMOUNTS = "123";
    import("./envs")
      .then((module) => {
        expect(module).toBeDefined();
        expect(() => {
          module.getEnvs();
        }).not.toThrow();
        const {
          PG_PORT,
          PG_USER,
          PG_HOST,
          PG_PASSWORD,
          PG_DATABASE,
          MAX_LITER_AMOUNTS,
        } = module.getEnvs();
        expect(PG_PORT).toBe(1234);
        expect(PG_USER).toBe("foo");
        expect(PG_HOST).toBe("foo");
        expect(PG_PASSWORD).toBe("foo");
        expect(PG_DATABASE).toBe("foo");
        expect(MAX_LITER_AMOUNTS).toBe(123);
      })
      .catch((err) => {
        throw err;
      });
  });

  test("should throw error due to missing jwksuri", () => {
    // const origProcessEnv = process.env;
    // process.env.jwksuri = "foo";
    process.env.audience = "foo";
    process.env.issuer = "foo";
    import("./envs")
      .then((module) => {
        expect(module).toBeDefined();
        expect(() => {
          module.getEnvs();
        }).toThrow();
      })
      .catch((err) => {
        throw err;
      });
  });

  test("should throw error due to missing audience", () => {
    // const origProcessEnv = process.env;
    process.env.jwksuri = "foo";
    // process.env.audience = "foo";
    process.env.issuer = "foo";
    import("./envs")
      .then((module) => {
        expect(module).toBeDefined();
        expect(() => {
          module.getEnvs();
        }).toThrow();
      })
      .catch((err) => {
        throw err;
      });
  });
  test("should throw error due to missing issuer", () => {
    // const origProcessEnv = process.env;
    process.env.jwksuri = "foo";
    process.env.audience = "foo";
    // process.env.issuer = "foo";
    import("./envs")
      .then((module) => {
        expect(module).toBeDefined();
        expect(() => {
          module.getEnvs();
        }).toThrow();
      })
      .catch((err) => {
        throw err;
      });
  });
});
