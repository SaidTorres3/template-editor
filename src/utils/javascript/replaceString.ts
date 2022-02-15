export function replaceStr(opts: ReplaceStringOpts): string {
  return (
    opts.str.substring(0, opts.firstPos) +
    opts.stringToAdd +
    opts.str.substring(opts.secondPos)
  );
}

interface ReplaceStringOpts {
  str: string;
  firstPos: number;
  secondPos: number;
  stringToAdd: string;
}
