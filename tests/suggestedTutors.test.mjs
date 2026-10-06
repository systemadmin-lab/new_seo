import assert from "node:assert/strict";
import test from "node:test";
import {
  getSuggestedTutors,
  savedSuggestedTutors,
  selectSuggestedTutors,
  suggestedTutorsApi,
} from "../app/lib/suggestedTutors.ts";

const records = savedSuggestedTutors.map(({ id, name, picture }) => ({ id, name, picture }));

test("API order does not change selected tutor identities; current names and opaque photo URLs are preserved", () => {
  const updated = { ...records[0], name: " Updated tutor name ", picture: "https://musecooldevstorage.blob.core.windows.net/files/https%3A//portrait.jpg.jpg" };
  const selected = selectSuggestedTutors([records[1], { id: "unselected", name: "Other tutor", picture: records[1].picture }, updated]);
  assert.deepEqual(selected.map(tutor => tutor.id), records.map(tutor => tutor.id));
  assert.equal(selected[0].name, "Updated tutor name");
  assert.equal(selected[0].picture, updated.picture);
  assert.equal(selected[0].fallbackPicture, savedSuggestedTutors[0].fallbackPicture);
  assert.equal(selected[1].name, records[1].name);
});

test("missing, duplicate or invalid records use a photo and name from the same verified tutor", () => {
  for (const payload of [null, {}, [], [records[0], records[0]], [{ ...records[0], name: " " }], [{ ...records[0], picture: "https://example.com/not-a-tutor.jpg" }], [{ ...records[0], picture: "javascript:alert(1)" }]]) {
    const selected = selectSuggestedTutors(payload);
    assert.equal(selected.length, 2);
    assert.deepEqual(selected.map(tutor => tutor.name), savedSuggestedTutors.map(tutor => tutor.name));
    assert.deepEqual(selected.map(tutor => tutor.picture), savedSuggestedTutors.map(tutor => tutor.fallbackPicture));
  }
  const mixed = selectSuggestedTutors([{ ...records[0], picture: "http://example.com/photo.jpg" }, records[1]]);
  assert.equal(mixed[0].picture, savedSuggestedTutors[0].fallbackPicture);
  assert.equal(mixed[1].picture, records[1].picture);
});

test("server fetch uses the carousel API with bounded requests and hourly caching", async () => {
  const selected = await getSuggestedTutors(async (url, options) => {
    assert.equal(url, suggestedTutorsApi);
    assert.equal(options.next.revalidate, 3600);
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json(records);
  });
  assert.deepEqual(selected.map(tutor => tutor.picture), records.map(tutor => tutor.picture));
});

test("an API outage, HTTP error or malformed JSON keeps both saved profiles available", async () => {
  for (const fetchImpl of [
    async () => { throw new Error("API unavailable"); },
    async () => new Response("Unavailable", { status: 503 }),
    async () => new Response("not JSON", { status: 200 }),
  ]) {
    const selected = await getSuggestedTutors(fetchImpl);
    assert.deepEqual(selected.map(tutor => tutor.picture), savedSuggestedTutors.map(tutor => tutor.fallbackPicture));
  }
});
