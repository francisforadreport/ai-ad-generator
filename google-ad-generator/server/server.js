   // Clear Node.js module cache
   Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })

   // Run the actual server
   require('./src/index.js')
