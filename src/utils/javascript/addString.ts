export function addStr(opts: AddStringOpts): string {
  return (
    opts.string.substring(0, opts.index) + opts.stringToAdd + opts.string.substring(opts.index, opts.string.length)
  );
}

interface AddStringOpts {
  string: string;
  index: number;
  stringToAdd: string;
}
