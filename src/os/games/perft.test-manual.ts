import { parseFen, perft } from "./chess";

const cases: [string, string, number[]][] = [
  ["start", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [20, 400, 8902, 197281]],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", [48, 2039, 97862]],
  ["position3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", [14, 191, 2812, 43238]],
  ["position4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", [6, 264, 9467]],
  ["position5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", [44, 1486, 62379]],
];

let fail = 0;
for (const [name, fen, expected] of cases) {
  for (let d = 1; d <= expected.length; d++) {
    const got = perft(parseFen(fen), d);
    const want = expected[d - 1];
    const ok = got === want;
    if (!ok) fail++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(10)} depth ${d}  got ${String(got).padStart(7)}  want ${String(want).padStart(7)}`);
  }
}
console.log(fail === 0 ? "\nALL PERFT TESTS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
