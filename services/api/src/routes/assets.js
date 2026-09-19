import { openPool, sql } from "../db/pool.js";
import { AssetInput, ListQuery } from "../schemas/asset.js";

function toAsset(row) {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function badRequest(reply, detail) {
  return reply.code(400).type("application/problem+json").send({
    type: "about:blank",
    title: "Bad Request",
    status: 400,
    detail,
  });
}

export async function assetRoutes(app) {
  app.get("/assets", async (req, reply) => {
    const parsed = ListQuery.safeParse(req.query);
    if (!parsed.success) return badRequest(reply, parsed.error.message);

    const pool = await openPool();
    const result = await pool
      .request()
      .input("limit", sql.Int, parsed.data.limit)
      .query(
        "select top (@limit) id, name, kind, created_at, updated_at " +
          "from dbo.assets where is_deleted = 0 order by created_at desc",
      );

    const data = result.recordset.map(toAsset);
    return reply.send({ data, meta: { count: data.length } });
  });

  app.get("/assets/:id", async (req, reply) => {
    const pool = await openPool();
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(
        "select id, name, kind, created_at, updated_at " +
          "from dbo.assets where id = @id and is_deleted = 0",
      );

    const row = result.recordset[0];
    if (!row) {
      return reply
        .code(404)
        .type("application/problem+json")
        .send({
          type: "about:blank",
          title: "Not Found",
          status: 404,
          detail: `No asset ${req.params.id} found.`,
          instance: req.url,
        });
    }

    return reply.send({ data: toAsset(row) });
  });

  app.post("/assets", async (req, reply) => {
    const parsed = AssetInput.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, parsed.error.message);

    const pool = await openPool();
    const result = await pool
      .request()
      .input("name", sql.NVarChar(120), parsed.data.name)
      .input("kind", sql.NVarChar(20), parsed.data.kind)
      .query(
        "insert into dbo.assets (name, kind) " +
          "output inserted.id, inserted.name, inserted.kind, inserted.created_at, inserted.updated_at " +
          "values (@name, @kind)",
      );

    return reply.code(201).send({ data: toAsset(result.recordset[0]) });
  });
}
