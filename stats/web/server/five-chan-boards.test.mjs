import assert from "node:assert/strict";
import test from "node:test";
import { FIVE_CHAN_BOARDS_KEY, createFiveChanBoardsSource } from "./five-chan-boards.mjs";

const fileReader = (files) => async (filePath) => {
  if (!Object.hasOwn(files, filePath)) {
    throw Object.assign(new Error(`ENOENT: no such file, open '${filePath}'`), {
      code: "ENOENT",
    });
  }
  return files[filePath];
};

test("builds the boards document from the monitor's file, keeping only its known fields", async () => {
  const boards = [{ address: "a.bso", updatedAt: null, stats: null, threads: [] }];
  const source = createFiveChanBoardsSource({
    filePath: "/exports/5chan-boards.json",
    readFile: fileReader({
      "/exports/5chan-boards.json": JSON.stringify({
        version: 1,
        generatedAt: 1792500000,
        boards,
        debug: "not part of the API",
      }),
    }),
  });

  const { documents, errors } = await source.documents();
  assert.deepEqual(errors, []);
  assert.deepEqual(documents.get(FIVE_CHAN_BOARDS_KEY), {
    version: 1,
    generatedAt: 1792500000,
    boards,
  });
});

test("reports an unreadable file once and builds nothing from it", async () => {
  const files = {};
  const source = createFiveChanBoardsSource({
    filePath: "/exports/5chan-boards.json",
    readFile: fileReader(files),
  });

  const first = await source.documents();
  assert.equal(first.documents.size, 0);
  assert.match(first.errors[0], /cannot read \/exports\/5chan-boards\.json: ENOENT/);
  assert.deepEqual((await source.documents()).errors, []);

  for (const body of ["{", JSON.stringify({ version: 2, generatedAt: 1, boards: [] })]) {
    files["/exports/5chan-boards.json"] = body;
    const { documents, errors } = await source.documents();
    assert.equal(documents.size, 0);
    assert.equal(errors.length, 1);
  }
});
