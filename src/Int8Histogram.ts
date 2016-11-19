/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
import { AbstractHistogram } from "./AbstractHistogram";

class Int8Histogram extends AbstractHistogram {

  counts: Uint8Array
  totalCount: number;

  constructor(
    lowestDiscernibleValue: number, 
    highestTrackableValue: number, 
    numberOfSignificantValueDigits: number) {

    super(
      lowestDiscernibleValue, 
      highestTrackableValue, 
      numberOfSignificantValueDigits
    );
    this.totalCount = 0;
    this.counts = new Uint32Array(this.countsArrayLength);
  }

  incrementCountAtIndex(index: number) {
    const currentCount = this.counts[index];
    const newCount = currentCount + 1;
    if (newCount < 0) {
      throw new Error("would overflow short integer count");
    }
    this.counts[index] = newCount;
  }

  addToCountAtIndex(index: number, value: number) {
    const currentCount = this.counts[index];
    const newCount = currentCount + value;
    if ((newCount < Number.MIN_SAFE_INTEGER) || (newCount > Number.MAX_SAFE_INTEGER)) {
      throw "would overflow integer count";
    }
    this.counts[index] = newCount;
  }

  resize(newHighestTrackableValue: number) {
    this.establishSize(newHighestTrackableValue);
    const newCounts = new Uint8Array(this.countsArrayLength);
    newCounts.set(this.counts);
    this.counts = newCounts;
  }

  setNormalizingIndexOffset(normalizingIndexOffset: number) {
  }

  incrementTotalCount() {
    this.totalCount++;
  }

  getTotalCount() {
    return this.totalCount;
  }

  getCountAtIndex(index: number)  {
    return this.counts[index];
  }

  protected _getEstimatedFootprintInBytes() {
    return (512 + this.counts.length);
  }

}

export default Int8Histogram; 