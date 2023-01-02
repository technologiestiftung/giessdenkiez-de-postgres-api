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
        } = module.getEnvs();
        expect(PG_PORT).toBe(54322);
        expect(PG_USER).toBe("postgres");
        expect(PG_HOST).toBe("localhost");
        expect(PG_PASSWORD).toBe("postgres");
        expect(PG_DATABASE).toBe("postgres");
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
        } = module.getEnvs();
        expect(PG_PORT).toBe(1234);
        expect(PG_USER).toBe("foo");
        expect(PG_HOST).toBe("foo");
        expect(PG_PASSWORD).toBe("foo");
        expect(PG_DATABASE).toBe("foo");
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
