import * as assert from 'assert'
import * as fs from 'fs'
import { fromPng, toPng } from '@rgba-image/png'
import { createImage } from '@rgba-image/create-image'
import { nearestNeighbour } from '..';

const patternPng = fs.readFileSync( './src/test/fixtures/pattern.png' )
const patternBorderPng = fs.readFileSync( './src/test/fixtures/pattern-border.png' )
const expectPatternHalfPng = fs.readFileSync( './src/test/fixtures/pattern-half.png' )
const expectPatternDoublePng = fs.readFileSync( './src/test/fixtures/pattern-double.png' )
const expectPatternHalfRegionPng = fs.readFileSync( './src/test/fixtures/pattern-half-region.png' )
const expectPatternDoubleRegionPng = fs.readFileSync( './src/test/fixtures/pattern-double-region.png' )
const expectPatternOutOfBoundsPng = fs.readFileSync( './src/test/fixtures/pattern-out-of-bounds.png' )

const pattern = fromPng( patternPng )
const patternBorder = fromPng( patternBorderPng )
const expectPatternHalf = fromPng( expectPatternHalfPng )
const expectPatternDouble = fromPng( expectPatternDoublePng )
const expectPatternHalfRegion = fromPng( expectPatternHalfRegionPng )
const expectPatternDoubleRegion = fromPng( expectPatternDoubleRegionPng )
const expectPatternOutOfBounds = fromPng( expectPatternOutOfBoundsPng )

const getNoise = () => {
  const width = 2048
  const height = 2048
  const noise = createImage( width, height )

  for ( let y = 0; y < height; y++ ) {
    for ( let x = 0; x < width; x++ ) {
      const index = ( y * width + x ) * 4
      noise.data[ index ] = ( Math.random() * 256 ) | 0
      noise.data[ index + 1 ] = ( Math.random() * 256 ) | 0
      noise.data[ index + 2 ] = ( Math.random() * 256 ) | 0
      noise.data[ index + 3 ] = ( Math.random() * 256 ) | 0
    }
  }

  return noise
}

const noise = getNoise()

describe( 'nearest neighbour', () => {
  it( 'resizes down', () => {
    const patternHalf = createImage( 4, 4 )

    nearestNeighbour( pattern, patternHalf )

    assert.deepEqual( patternHalf, expectPatternHalf )
  })

  it( 'resizes up', () => {
    const patternDouble = createImage( 16, 16 )

    nearestNeighbour( pattern, patternDouble )

    assert.deepEqual( patternDouble, expectPatternDouble )
  })

  it( 'resizes region down', () => {
    const patternHalfRegion = createImage( 6, 6 )

    nearestNeighbour( patternBorder, patternHalfRegion, 2, 2, 8, 8, 1, 1, 4, 4 )

    assert.deepEqual( patternHalfRegion, expectPatternHalfRegion )
  })

  it( 'resizes region up', () => {
    const patternDoubleRegion = createImage( 18, 18 )

    nearestNeighbour( patternBorder, patternDoubleRegion, 2, 2, 8, 8, 1, 1, 16, 16 )

    assert.deepEqual( patternDoubleRegion, expectPatternDoubleRegion )
  })

  it( 'early return when any dimension is 0', () => {
    const empty = createImage( 8, 8 )
    const destSw = createImage( 8, 8 )
    const destSh = createImage( 8, 8 )
    const destDw = createImage( 8, 8 )
    const destDh = createImage( 8, 8 )

    nearestNeighbour( destSw, pattern, 0, 0, 0, 8 )
    nearestNeighbour( destSh, pattern, 0, 0, 8, 0 )
    nearestNeighbour( destDw, pattern, 0, 0, 8, 8, 0, 0, 0, 8 )
    nearestNeighbour( destDh, pattern, 0, 0, 8, 8, 0, 0, 8, 0 )

    assert.deepEqual( destSw, empty )
    assert.deepEqual( destSh, empty )
    assert.deepEqual( destDw, empty )
    assert.deepEqual( destDh, empty )
  })

  it( 'does not sample outside bounds', () => {
    const patternOutOfBounds = createImage( 8, 8 )

    nearestNeighbour( pattern, patternOutOfBounds, 0, 0, 16, 16, 0, 0, 32, 32 )

    assert.deepEqual( patternOutOfBounds, expectPatternOutOfBounds )
  } )

  // no test, just lazy benchmarking
  it( 'big resize down', () => {
    const dest = createImage( 1024, 1024 )

    nearestNeighbour( noise, dest, 0, 0, 2560, 2560, 0, 0, 1280, 1280 )
  } )

  // no test, just lazy benchmarking
  it( 'big resize up', () => {
    const dest = createImage( 3072, 3072 )

    nearestNeighbour( noise, dest, 0, 0, 2560, 2560, 0, 0, 3840, 3840 )
  } )
})