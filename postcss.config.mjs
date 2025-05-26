// Make sure the filename is postcss.config.js if using module.exports
// or postcss.config.mjs if using export default with "type": "module" in package.json
// For simplicity with `export default`, let's assume it's postcss.config.mjs
// If it's postcss.config.js, use module.exports = { ... }

export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {}
  }
}

// If your file is postcss.config.js, it should be:
// module.exports = {
//   plugins: {
//     'tailwindcss': {},
//     'autoprefixer': {}
//   }
// }