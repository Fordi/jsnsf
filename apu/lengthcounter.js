export default class LengthCounter {
  constructor(mem, base) {
    /** @private @const {!Memory.Register<boolean>} */
    this.enabled_ = mem.bool(0x4015, (base >>> 2) & 7);
    /** @private @const {!Memory.Register<number>} */
    this.reload_ = mem.int(base + 3, 3, 5, 'lcr');
    /** @private {number} */
    this.counter_ = 1; // TODO - so that it's nonzero if it's never clocked...?

    /** @private {function()} */
    this.disableCallback_ = function() {};

    mem.listen(0x4015, () => { if (!this.enabled_.get()) this.disable(); });
  }

  /** @param {function()} callback */
  onDisable(callback) {
    this.disableCallback_ = callback;
  }

  clock() {
    if (this.counter_ > 0) this.counter_--;
    if (!this.counter_ && this.enabled_.get()) this.enabled_.set(false);
  }

  start() {
    if (this.enabled_.get()) {
      this.counter_ = LengthCounter.LENGTHS[this.reload_.get()];
    }
  }

  disable() {
    this.counter_ = 0;
    this.disableCallback_();
  }

  /** @return {boolean} */
  enabled() {
    return !!this.counter_;
  }
}


/**
 * List of lengths.
 * @const {!Array<number>}
 */
LengthCounter.LENGTHS = [
  10,254, 20,  2, 40,  4, 80,  6, 160,  8, 60, 10, 14, 12, 26, 14,
  12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
