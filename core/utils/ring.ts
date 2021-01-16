const NOT_SET = Symbol();

/**
 * A FIFO ring-buffer with a fixed capacity.
 */
export class Ring<T> {
  private readonly buffer: (T | typeof NOT_SET)[];
  private wIndex = 0;
  private rIndex = 0;

  /**
   * Construct a new fixed-size ring-buffer with the given capacity.
   * @param capacity The size of the buffer.
   */
  constructor(readonly capacity: number) {
    if (typeof capacity !== 'number' || capacity <= 0 || !Number.isFinite(capacity))
      throw new Error('Invalid capacity.');
    this.buffer = Array(capacity).fill(NOT_SET);
  }

  /**
   * Return whether this ring-buffer is empty or not.
   */
  isEmpty() {
    return this.buffer[this.rIndex] === NOT_SET;
  }

  /**
   * Insert a new item in the queue, if the queue is full it simply overwrites the oldest entry.
   * @param item The item to be inserted.
   */
  enqueue(item: T) {
    const wIndex = this.wIndex;
    this.buffer[wIndex] = item;
    this.wIndex = (wIndex + 1) % this.capacity;
  }

  /**
   * Return & remove the oldest data in this buffer or `undefined` in case the buffer is empty.
   */
  dequeue(): T | undefined {
    const rIndex = this.rIndex;
    const data = this.buffer[rIndex];
    if (data === NOT_SET) return undefined;
    this.buffer[rIndex] = NOT_SET;
    this.rIndex = (rIndex + 1) % this.capacity;
    return data;
  }
}
