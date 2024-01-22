const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "package.json");

const incrementVersion = () => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const [major, minor, patch] = packageJson.version.split(".").map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    packageJson.version = newVersion;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Version incremented to ${newVersion}`);
  } catch (error) {
    console.error("Error incrementing version:", error.message);
  }
};

incrementVersion();
