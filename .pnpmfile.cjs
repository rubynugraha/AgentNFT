function readPackage(pkg) {
  // Allow missing peer dependencies during install
  if (!pkg.peerDependencies) {
    pkg.peerDependencies = {}
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
