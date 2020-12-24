const production = !process.env.ROLLUP_WATCH;

module.exports = {
  purge: {
    content: [
    "./src/**/*.svelte",
    "./public/**/*.html"
    ],
    css: ["./public/**/*.css"],
    enabled: production // disable purge in dev  
  }
};
