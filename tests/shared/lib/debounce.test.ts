import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "@/shared/lib/debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // テスト1: 連続呼び出しで最後の呼び出しから delayMs 経過後に1回だけ実行される
  it("最後の呼び出しから delayMs 経過した時点で1回だけ実行される", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // 短時間に複数回呼び出す
    debouncedFn();
    debouncedFn();
    debouncedFn();

    // delayMs 経過前は実行されない
    expect(fn).not.toHaveBeenCalled();

    // delayMs 経過後
    vi.advanceTimersByTime(100);

    // 1回だけ実行される
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // テスト2: delayMs 経過前の呼び出しでタイマーがリセットされる
  it("delayMs 経過前に呼び出しを繰り返すとタイマーがリセットされ続ける", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // 最初の呼び出し
    debouncedFn();
    vi.advanceTimersByTime(50);

    // タイマーリセット前は実行されない
    expect(fn).not.toHaveBeenCalled();

    // タイマーがリセットされる
    debouncedFn();
    vi.advanceTimersByTime(50);

    // まだ実行されない（合計100msだが最後の呼び出しから50msしか経過していない）
    expect(fn).not.toHaveBeenCalled();

    // 最後の呼び出しから100ms経過
    vi.advanceTimersByTime(100);

    // 1回だけ実行される
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // テスト3: 呼び出し後に繰り返される場合、合計時間がいくら経過しても呼び出しが続く限り実行されない
  it("呼び出しが繰り返される間は実行されない", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 50);

    // 200ms の間、50ms ごとに呼び出す
    for (let i = 0; i < 5; i++) {
      debouncedFn();
      vi.advanceTimersByTime(40);
    }

    // まだ実行されない
    expect(fn).not.toHaveBeenCalled();

    // 最後の呼び出しから 50ms 経過
    vi.advanceTimersByTime(50);

    // 1回だけ実行される
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // テスト4: 単一引数が正しく渡される
  it("単一引数が元の関数に渡される", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn("test-value");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("test-value");
  });

  // テスト5: 複数引数が正しく渡される
  it("複数引数が元の関数に渡される", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn("arg1", "arg2", 42, true);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("arg1", "arg2", 42, true);
  });

  // テスト6: 最後の呼び出しの引数だけが使われる
  it("連続呼び出しの場合、最後の呼び出しの引数だけが使われる", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn("first");
    debouncedFn("second");
    debouncedFn("last");

    vi.advanceTimersByTime(100);

    // 最後の呼び出しの引数だけが渡される
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith("last");
  });

  // テスト7: 2つの独立した debounced 関数が互いに干渉しない
  it("独立した2つの debounced 関数は互いに干渉しない", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const debouncedFn1 = debounce(fn1, 100);
    const debouncedFn2 = debounce(fn2, 100);

    // fn1 を呼び出す（時刻 0）
    debouncedFn1();
    vi.advanceTimersByTime(50);

    // fn2 を呼び出す（時刻 50）
    debouncedFn2();
    vi.advanceTimersByTime(40);

    // 時刻 90。どちらもまだ実行されない
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    // fn1 の delayMs が経過（時刻 100）
    vi.advanceTimersByTime(10);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).not.toHaveBeenCalled();

    // fn2 の delayMs が経過（時刻 150）
    vi.advanceTimersByTime(50);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  // テスト8: 異なる delayMs で独立した debounced 関数が動作する
  it("異なる delayMs の debounced 関数は独立に動作する", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const debouncedFn1 = debounce(fn1, 50);
    const debouncedFn2 = debounce(fn2, 100);

    debouncedFn1();
    debouncedFn2();

    // 50ms 経過
    vi.advanceTimersByTime(50);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).not.toHaveBeenCalled();

    // さらに 50ms 経過
    vi.advanceTimersByTime(50);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  // テスト9: オブジェクト引数が正しく渡される
  it("オブジェクト引数が元の関数に渡される", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    const obj = { key: "value", nested: { prop: 123 } };
    debouncedFn(obj);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith(obj);
  });

  // テスト10: delayMs = 0 でも動作する
  it("delayMs = 0 の場合、即座（マイクロタスク後）に実行される", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 0);

    debouncedFn();
    // delayMs = 0 でも setTimeout のため即座には実行されない
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
