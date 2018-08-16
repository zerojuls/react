import * as fs from 'fs'
import * as glob from 'glob'
import { src, task, parallel, series } from 'gulp'
import * as gzip from 'gzip-size'
import * as _ from 'lodash'
import * as prettyBytes from 'pretty-bytes'
import * as uglifyES from 'uglify-es'

import config from '../../../config'

const { version } = require('../../../package.json')
const { paths } = config

// ----------------------------------------
// Stats
// ----------------------------------------

task('build:stats', cb => {
  const stats = {
    [version]: {
      components: 0,
      subcomponents: 0,
      componentsMin: 0,
      componentsGzip: 0,
    },
  }

  glob(paths.docsSrc('componentInfo', '*.info.json'), (err, infoFiles) => {
    if (err) return cb(err)

    infoFiles.forEach((infoFile, infoFileIndex) => {
      const { displayName, isChild, isParent } = require(infoFile)
      if (isChild) {
        stats[version].subcomponents += 1
      }

      if (isParent) {
        stats[version].components += 1

        glob(paths.dist('es', 'components', displayName, '*.js'), (err, jsFiles) => {
          if (err) return cb(err)

          stats[version][displayName] = {
            min: 0,
            gzip: 0,
          }

          jsFiles.forEach(jsFile => {
            const content = fs.readFileSync(jsFile, 'utf8')
            const minified = uglifyES.minify(content).code
            const minBytes = minified.length
            const gzipBytes = gzip.sync(minified)

            stats[version].componentsMin += minBytes
            stats[version].componentsGzip += gzipBytes
            stats[version][displayName].min += minBytes
            stats[version][displayName].gzip += gzipBytes
          })

          stats[version][displayName].min = prettyBytes(stats[version][displayName].min)
          stats[version][displayName].gzip = prettyBytes(stats[version][displayName].gzip)

          if (infoFileIndex === infoFiles.length - 1) {
            stats[version].componentsMin = prettyBytes(stats[version].componentsMin)
            stats[version].componentsGzip = prettyBytes(stats[version].componentsGzip)

            const statsPath = paths.docsSrc('stats.json')
            const originalStats = require(paths.docsSrc('stats.json'))
            const mergedStats = _.merge(originalStats, stats)
            fs.writeFileSync(statsPath, JSON.stringify(mergedStats, null, 2))
            cb()
          }
        })
      }
    })
  })
})

// ----------------------------------------
// Default
// ----------------------------------------

task(
  'stats',
  series(
    parallel(
      series('clean:dist:es', 'build:dist:es'),
      series('clean:docs:component-info', 'build:docs:component-info'),
    ),
    'build:stats',
  ),
)
