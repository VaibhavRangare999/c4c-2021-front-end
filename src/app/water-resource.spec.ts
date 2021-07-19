import { WaterResource } from './water-resource';

describe('WaterResource', () => {
  it('should create an instance', () => {
    expect(new WaterResource(0, 0, '', '', '', '')).toBeTruthy();
  });
});
