// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {computeThreshold, noiseOf, typicalOps} from '../../stats';

describe('stats', () => {
  const saved = {...process.env};

  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('BENCH_')) delete process.env[key];
    }
  });

  afterEach(() => {
    process.env = {...saved};
  });

  describe('noiseOf', () => {
    it('gives the coefficient of variation in %', () => {
      // mean 100, sample standard deviation 10
      expect(noiseOf([90, 100, 110])).to.be.approximately(10, 1e-9);
    });

    it('needs BENCH_MIN_NOISE_HISTORY runs', () => {
      expect(noiseOf([90, 110])).to.be.undefined();

      process.env.BENCH_MIN_NOISE_HISTORY = '2';
      expect(noiseOf([90, 110])).to.be.above(0);
    });

    it('ignores a history whose mean is not positive', () => {
      expect(noiseOf([0, 0, 0])).to.be.undefined();
    });
  });

  describe('computeThreshold', () => {
    it('uses BENCH_THRESHOLD without enough history', () => {
      expect(computeThreshold([100, 100])).to.eql({threshold: 15});
    });

    it('scales the noise by the multiplier', () => {
      // 3% noise × 4 = 12%, inside [10, 15]
      expect(computeThreshold([97, 100, 103]).threshold).to.be.approximately(
        12,
        1e-9,
      );
    });

    it('clamps to the floor and the ceiling', () => {
      expect(computeThreshold([100, 100, 100]).threshold).to.equal(10);
      expect(computeThreshold([50, 100, 150]).threshold).to.equal(15);
    });

    it('lets the noisier history decide', () => {
      const quiet = [100, 100, 100];
      const noisy = [97, 100, 103];
      expect(computeThreshold(quiet, noisy).noise).to.be.approximately(3, 1e-9);
    });

    it('turns off with a multiplier of 0', () => {
      process.env.BENCH_NOISE_MULTIPLIER = '0';
      expect(computeThreshold([97, 100, 103])).to.eql({threshold: 15});
    });

    it('never puts the floor above the ceiling', () => {
      process.env.BENCH_THRESHOLD = '5';
      expect(computeThreshold([100, 100, 100]).threshold).to.equal(5);
    });
  });

  describe('typicalOps', () => {
    it('drops a run far from the median', () => {
      // 300 is 200% from the median 100, past the 40% limit
      expect(typicalOps([90, 100, 110, 300])).to.be.approximately(100, 1e-9);
    });

    it('keeps both speeds of a two-speed benchmark', () => {
      expect(typicalOps([100, 100, 130, 130, 130])).to.equal(118);
    });

    it('falls back to the median when every run is too far', () => {
      expect(typicalOps([10, 100])).to.equal(55);
    });

    it('compares medians with BENCH_OUTLIER_PERCENT=0', () => {
      process.env.BENCH_OUTLIER_PERCENT = '0';
      expect(typicalOps([90, 100, 130])).to.equal(100);
    });
  });
});
