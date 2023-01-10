export const mockReturnValue = function (fn, value: any) {
  const fnMock = fn as jest.Mocked<typeof fn>;
  fnMock.mockReturnValue(value);
};

export default {};
