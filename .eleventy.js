module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  // Copy assets & CMS if needed
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
