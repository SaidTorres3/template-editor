import { DoesStringRepresentPrimitivePipe } from './does-string-represent-primitive.pipe';

describe('DoesStringRepresentPrimitivePipe', () => {
  it('create an instance', () => {
    const pipe = new DoesStringRepresentPrimitivePipe();
    expect(pipe).toBeTruthy();
  });
});
