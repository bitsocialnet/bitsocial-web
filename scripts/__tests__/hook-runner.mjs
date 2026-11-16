// Just enough React to step a hook in node:test without a DOM. `reactHooksStub` swaps `react` and
// its JSX runtime for stand-ins that run against the active runner: state lives in slots, effects
// run after each render, and function components render inline, like one flattened component.

const stubSource = `
const hooks = () => globalThis.__hookRunner;
export const Fragment = Symbol.for("react.fragment");
export const Profiler = Symbol.for("react.profiler");
export const useState = (initial) => hooks().useState(initial);
export const useEffect = (effect, deps) => hooks().useEffect(effect, deps);
export const createContext = (defaultValue) => ({ defaultValue, Provider: { context: true } });
export const useContext = (context) => context.defaultValue;
export const jsx = (type, props) => (typeof type === "function" ? type(props) : { type, props });
export const jsxs = jsx;
export default { Fragment, Profiler, createContext, useContext, useEffect, useState };
`;

export const reactHooksStub = {
  name: "react-hooks-stub",
  setup(builder) {
    builder.onResolve({ filter: /^react(\/jsx-runtime)?$/ }, (args) => ({
      path: args.path,
      namespace: "react-hooks-stub",
    }));
    builder.onLoad({ filter: /.*/, namespace: "react-hooks-stub" }, () => ({
      contents: stubSource,
      loader: "js",
    }));
  },
};

/** Renders `component` until its state settles; `render` again after async work sets state. */
export function createHookRunner(component) {
  const slots = [];
  let cursor = 0;
  let queued = [];
  let dirty = false;
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) {
        slots[index] = typeof initial === "function" ? initial() : initial;
      }
      const setState = (next) => {
        const value = typeof next === "function" ? next(slots[index]) : next;
        if (!Object.is(value, slots[index])) {
          slots[index] = value;
          dirty = true;
        }
      };
      return [slots[index], setState];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      const previous = slots[index];
      const unchanged =
        previous !== undefined &&
        deps !== undefined &&
        deps.length === previous.deps.length &&
        deps.every((dep, i) => Object.is(dep, previous.deps[i]));
      if (unchanged) {
        return;
      }
      queued.push(() => {
        previous?.cleanup?.();
        slots[index] = { deps: deps ?? [], cleanup: effect(), effect: true };
      });
    },
  };

  return {
    render() {
      for (let pass = 0; pass < 25; pass += 1) {
        dirty = false;
        cursor = 0;
        globalThis.__hookRunner = hooks;
        const output = component();
        const effects = queued;
        queued = [];
        for (const run of effects) {
          run();
        }
        if (!dirty) {
          return output;
        }
      }
      throw new Error("Rendering did not settle.");
    },
    unmount() {
      for (const slot of slots) {
        if (slot?.effect) {
          slot.cleanup?.();
        }
      }
    },
  };
}
