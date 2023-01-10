export const mockReturnValue = function<ValueType> (fn, value: ValueType) {
  const fnMock = fn as jest.Mocked<typeof fn>;
  fnMock.mockReturnValue(value);
};

export default {};
