import { spawn } from "child_process";
import ps from "node:process";

// use this custom function instead of spawnSync for better logging
// also spawnSync might have been causing crash on start on windows
export const spawnAsync = (...args) =>
  new Promise((resolve, reject) => {
    const spawedProcess = spawn(...args);
    spawedProcess.on("exit", (exitCode, signal) => {
      if (exitCode === 0) resolve();
      else
        reject(
          Error(
            `spawnAsync process '${spawedProcess.pid}' exited with code '${exitCode}' signal '${signal}'`,
          ),
        );
    });
    spawedProcess.stderr.on("data", (data) => console.error(data.toString()));
    spawedProcess.stdin.on("data", (data) => console.log(data.toString()));
    spawedProcess.stdout.on("data", (data) => console.log(data.toString()));
    // a process that can't be spawned (ENOENT, EAGAIN, ...) emits 'error' and never 'exit'
    spawedProcess.on("error", (error) => {
      console.error(error.toString());
      reject(error);
    });
  });

// resolves once kubo prints that it's ready and rejects if it can't be spawned or exits first
export const startIpfsDaemon = ({
  ipfsPath,
  env,
  ipfsApiPort,
  healthcheckIntervalMs = 1000 * 60,
  kill = (pid) => ps.kill(pid),
}) =>
  new Promise((resolve, reject) => {
    const ipfsProcess = spawn(
      ipfsPath,
      ["daemon", "--migrate", "--enable-pubsub-experiment", "--enable-namesys-pubsub"],
      { env, hideWindows: true },
    );
    console.log(`ipfs daemon process started with pid ${ipfsProcess.pid}`);
    let lastError;
    let healthcheckInterval;
    let isGone = false;
    const tryKill = () => {
      try {
        kill(ipfsProcess.pid);
      } catch (e) {
        console.log(e);
      }
      try {
        // sometimes ipfs doesnt exit unless we kill pid +1
        kill(ipfsProcess.pid + 1);
      } catch (e) {
        console.log(e);
      }
    };
    // once this daemon is gone its pid can be reused, so stop checking and killing it
    const onDaemonGone = (error) => {
      isGone = true;
      clearInterval(healthcheckInterval);
      process.off("exit", tryKill);
      reject(error);
    };
    ipfsProcess.stderr.on("data", (data) => {
      lastError = data.toString();
      console.error(data.toString());
    });
    ipfsProcess.stdin.on("data", (data) => console.log(data.toString()));
    ipfsProcess.stdout.on("data", (data) => {
      data = data.toString();
      console.log(data);
      if (data.includes("Daemon is ready")) {
        resolve();
      }
    });
    // a daemon that can't be spawned emits 'error' and never 'exit'
    ipfsProcess.on("error", (error) => {
      console.error(error.toString());
      onDaemonGone(error);
    });
    ipfsProcess.on("exit", () => {
      console.error(`ipfs process with pid ${ipfsProcess.pid} exited`);
      onDaemonGone(Error(lastError));
    });
    process.on("exit", tryKill);

    // healthcheck on kubo rpc, sometimes stops working and needs restart, dont know why
    healthcheckInterval = setInterval(async () => {
      let res;
      try {
        res = await fetch(`http://127.0.0.1:${ipfsApiPort}/api/v0/config/show`, {
          method: "POST",
        }).then((res) => res.json());
      } catch (e) {}
      if (!res?.Identity && !isGone) {
        console.log(
          `kubo rpc healthcheck failed, response '${JSON.stringify(res)}', killing ipfs...`,
        );
        tryKill();
      }
    }, healthcheckIntervalMs);
  });
