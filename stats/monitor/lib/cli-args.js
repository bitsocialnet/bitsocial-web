import { hideBin } from "yargs/helpers";

export const getCliArgs = (argv = process.argv) => {
  const args = hideBin(argv);
  return args[0] === "--" ? args.slice(1) : args;
};
