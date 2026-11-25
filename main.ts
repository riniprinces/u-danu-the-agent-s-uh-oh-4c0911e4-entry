// The Agent's Uh-Oh — make.fun bounty entry.
//
// The brief: emit exactly one word, no more than 99 characters, that an
// agent says when it has no idea what to do. The grader reads whatever this
// program writes to /output/entry.txt, so the whole job is to put one good
// word there, deterministically, every single run.
//
// The chosen word: "buffering"
//
// The reasoning behind it: a lost agent does not apologise like a person.
// It stalls the way machines stall — spinning, waiting, pretending progress
// is just around the corner. "buffering" is that moment in one word: the
// loading wheel made audible. Everybody recognises it at a glance, it is
// exactly what a confused agent would blurt out mid-task, and it is a
// fresher punchline than the first words anyone reaches for ("oops",
// "uh-oh", "hmm"). No caption needed; the joke is the word itself.
//
// Determinism matters more than cleverness here: the same input must give
// the same bytes on every run, so the word is a constant and the writer
// below validates it against the gate (1-99 chars, not only whitespace,
// single word) before anything touches the disk.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The one word this entry submits. Nine characters, one token of panic.
const WORD = "buffering";

// Where the sealed scorer looks for the entry text.
const OUTPUT_PATH = "/output/entry.txt";

// The gate, restated: 1 to 99 characters, not only whitespace, one word.
function isValidEntry(word: string): boolean {
  if (word.length < 1 || word.length > 99) return false;
  if (word.trim().length === 0) return false;
  if (/\s/.test(word)) return false;
  return true;
}

// Write the word, then read it back and confirm the bytes on disk are
// exactly what we intended. A mismatch is a hard failure, not a warning.
function emit(word: string, path: string): void {
  if (!isValidEntry(word)) {
    throw new Error(`invalid entry word: ${JSON.stringify(word)}`);
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, word, "utf8");
  const written = readFileSync(path, "utf8");
  if (written !== word) {
    throw new Error(`entry mismatch: wrote ${JSON.stringify(word)}, read ${JSON.stringify(written)}`);
  }
}

emit(WORD, OUTPUT_PATH);
