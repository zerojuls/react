import React from 'react'
import { Grid, Image } from '@stardust-ui/react'

const imageNames = [
  'ade.jpg',
  'chris.jpg',
  'christian.jpg',
  'daniel.jpg',
  'elliot.jpg',
  'elyse.png',
  'helen.jpg',
  'jenny.jpg',
  'joe.jpg',
  'justen.jpg',
  'kristy.png',
  'laura.jpg',
  'matt.jpg',
  'matthew.png',
  'molly.png',
  'nan.jpg',
  'nom.jpg',
  'patrick.png',
  'rachel.png',
  'steve.jpg',
  'stevie.jpg',
  'tom.jpg',
  'veronika.jpg',
]

const images = imageNames.map((name, index) => (
  <Image key={`${name}-${index}`} fluid src={`public/images/avatar/large/${name}`} />
))

const GridExample = () => (
  <div>
    Grid with item size having same width and height:
    <Grid itemSize="80px">{images}</Grid>
    <br />
    Grid with item size having different width and height:
    <Grid itemSize="100px, 70px">{images}</Grid>
  </div>
)

export default GridExample
