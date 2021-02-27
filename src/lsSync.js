const fs = require('fs')

const SLASH = process.platform === 'win32' ? '\'' : '/'
const RESULT = []

const getType = (path = '') => {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isFile()) return 'file'
    else if (fs.lstatSync(path).isDirectory()) return 'directory'
    else if (fs.lstatSync(path).isBlockDevice()) return 'block device'
    else if (fs.lstatSync(path).isCharacterDevice()) return 'character device'
    else if (fs.lstatSync(path).isSymbolicLink()) return 'symbolic link'
    else if (fs.lstatSync(path).isFIFO()) return 'FIFO'
    else if (fs.lstatSync(path).isSocket()) return 'socket'
    else return false
  } else {
    return false
  }
}

const getFileProperty = (_path = '') => {
  const byDotSlash = _path.split('.' + SLASH)
  const path = byDotSlash[byDotSlash.length - 1]

  const byDot = path.split('.')
  const ext = byDot.length > 1 ? byDot[byDot.length - 1] : false
  const extention = ext ? '.' + ext : false

  const bySlash = path.split(SLASH)
  const fileName = bySlash[bySlash.length - 1].includes('.') ? bySlash[bySlash.length - 1] : false
  const fileLocation = fileName ? _path.split(fileName)[0] : _path

  return {
    name: fileName,
    location: fileLocation,
    extention
  }
}

/**
 * lsSync
 * @param {String} dir root directory
 */
const lsSync = (dir = './') => {
  const allFiles = fs.readdirSync(dir)

  allFiles.forEach(file => {
    const _path = dir + SLASH + file
    const path = _path.replace(SLASH + SLASH, SLASH)

    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
      lsSync(path, RESULT)
    }

    const type = getType(path)
    const fileProperty = getFileProperty(path)

    RESULT.push({
      path,
      type,
      directory: fileProperty.location,
      file: fileProperty.name,
      extention: fileProperty.extention
    })
  })

  return RESULT
}

module.exports = lsSync
