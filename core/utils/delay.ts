/**
 * A FIFO queue.
 */
export class Delay<T> {
  private readonly buffer: T[];
  private cursor = 0;

  constructor(readonly capacity: number) {
    if (typeof capacity !== 'number' || capacity <= 0 || !Number.isFinite(capacity)) throw new Error('Invalid capacity.');
    this.buffer = Array(capacity).fill(undefined);
  }

  /**
   * Insert a new item to the queue and return the newly expired item.
   * @param item The item to be inserted.
   */
  insert(item: T): T | undefined {
    const index = this.cursor;
    const prev = this.buffer[index];
    this.buffer[index] = item;
    this.cursor = (index + 1) % this.capacity;
    return prev;
  }
}
