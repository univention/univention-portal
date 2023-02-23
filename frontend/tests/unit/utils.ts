export const mockReturnValue = function<ValueType> (fn, value: ValueType): void {
  const fnMock = fn as jest.Mocked<typeof fn>;
  fnMock.mockReturnValue(value);
};

export default {};
