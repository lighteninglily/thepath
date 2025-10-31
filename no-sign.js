// Custom signing function that does nothing - bypasses electron-builder's default signing
exports.default = async function(configuration) {
  console.log("✓ Code signing bypassed (not needed for this build)");
  return true;
};
