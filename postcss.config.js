export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Use the package name string as the key and the options object as the value
    '@csstools/postcss-oklab-function': {
      preserve: false // Or true, based on your preference for fallbacks
      // Add any other plugin options here
    }
  }
};
