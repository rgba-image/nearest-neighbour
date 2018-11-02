"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs = require("fs");
const png_1 = require("@rgba-image/png");
const create_image_1 = require("@rgba-image/create-image");
const __1 = require("..");
const patternPng = fs.readFileSync('./src/test/fixtures/pattern.png');
const patternBorderPng = fs.readFileSync('./src/test/fixtures/pattern-border.png');
const expectPatternHalfPng = fs.readFileSync('./src/test/fixtures/pattern-half.png');
const expectPatternDoublePng = fs.readFileSync('./src/test/fixtures/pattern-double.png');
const expectPatternHalfRegionPng = fs.readFileSync('./src/test/fixtures/pattern-half-region.png');
const expectPatternDoubleRegionPng = fs.readFileSync('./src/test/fixtures/pattern-double-region.png');
const expectPatternOutOfBoundsPng = fs.readFileSync('./src/test/fixtures/pattern-out-of-bounds.png');
const pattern = png_1.fromPng(patternPng);
const patternBorder = png_1.fromPng(patternBorderPng);
const expectPatternHalf = png_1.fromPng(expectPatternHalfPng);
const expectPatternDouble = png_1.fromPng(expectPatternDoublePng);
const expectPatternHalfRegion = png_1.fromPng(expectPatternHalfRegionPng);
const expectPatternDoubleRegion = png_1.fromPng(expectPatternDoubleRegionPng);
const expectPatternOutOfBounds = png_1.fromPng(expectPatternOutOfBoundsPng);
const getNoise = () => {
    const width = 2048;
    const height = 2048;
    const noise = create_image_1.createImage(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            noise.data[index] = (Math.random() * 256) | 0;
            noise.data[index + 1] = (Math.random() * 256) | 0;
            noise.data[index + 2] = (Math.random() * 256) | 0;
            noise.data[index + 3] = (Math.random() * 256) | 0;
        }
    }
    return noise;
};
const noise = getNoise();
describe('nearest neighbour', () => {
    it('resizes down', () => {
        const patternHalf = create_image_1.createImage(4, 4);
        __1.nearestNeighbour(pattern, patternHalf);
        assert.deepEqual(patternHalf, expectPatternHalf);
    });
    it('resizes up', () => {
        const patternDouble = create_image_1.createImage(16, 16);
        __1.nearestNeighbour(pattern, patternDouble);
        assert.deepEqual(patternDouble, expectPatternDouble);
    });
    it('resizes region down', () => {
        const patternHalfRegion = create_image_1.createImage(6, 6);
        __1.nearestNeighbour(patternBorder, patternHalfRegion, 2, 2, 8, 8, 1, 1, 4, 4);
        assert.deepEqual(patternHalfRegion, expectPatternHalfRegion);
    });
    it('resizes region up', () => {
        const patternDoubleRegion = create_image_1.createImage(18, 18);
        __1.nearestNeighbour(patternBorder, patternDoubleRegion, 2, 2, 8, 8, 1, 1, 16, 16);
        assert.deepEqual(patternDoubleRegion, expectPatternDoubleRegion);
    });
    it('early return when any dimension is 0', () => {
        const empty = create_image_1.createImage(8, 8);
        const destSw = create_image_1.createImage(8, 8);
        const destSh = create_image_1.createImage(8, 8);
        const destDw = create_image_1.createImage(8, 8);
        const destDh = create_image_1.createImage(8, 8);
        __1.nearestNeighbour(destSw, pattern, 0, 0, 0, 8);
        __1.nearestNeighbour(destSh, pattern, 0, 0, 8, 0);
        __1.nearestNeighbour(destDw, pattern, 0, 0, 8, 8, 0, 0, 0, 8);
        __1.nearestNeighbour(destDh, pattern, 0, 0, 8, 8, 0, 0, 8, 0);
        assert.deepEqual(destSw, empty);
        assert.deepEqual(destSh, empty);
        assert.deepEqual(destDw, empty);
        assert.deepEqual(destDh, empty);
    });
    it('does not sample outside bounds', () => {
        const patternOutOfBounds = create_image_1.createImage(8, 8);
        __1.nearestNeighbour(pattern, patternOutOfBounds, 0, 0, 16, 16, 0, 0, 32, 32);
        assert.deepEqual(patternOutOfBounds, expectPatternOutOfBounds);
    });
    // no test, just lazy benchmarking
    it('big resize down', () => {
        const dest = create_image_1.createImage(1024, 1024);
        __1.nearestNeighbour(noise, dest, 0, 0, 2560, 2560, 0, 0, 1280, 1280);
    });
    // no test, just lazy benchmarking
    it('big resize up', () => {
        const dest = create_image_1.createImage(3072, 3072);
        __1.nearestNeighbour(noise, dest, 0, 0, 2560, 2560, 0, 0, 3840, 3840);
    });
});
//# sourceMappingURL=index.js.map