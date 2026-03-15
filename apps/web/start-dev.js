const { spawn } = require("child_process");

const port = process.env.PORT || "3005";

// Pass command as a single string with shell:true to avoid Windows .cmd issues
// and avoid the DEP0190 deprecation warning (which only fires when args array + shell:true)
const child = spawn("npm run dev", {
  stdio: "inherit",
  shell: true,
  cwd: __dirname,
  env: { ...process.env, PORT: port },
});

child.on("error", (err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code !== 0) process.exit(code ?? 1);
});
