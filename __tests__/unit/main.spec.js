const {str_pad} = require('../../js/util.js')

it("number padding for rgb: 2 => 002", () => {
  expect(str_pad(3, 5)).toEqual('00003')
  expect(str_pad(2, 3)).toEqual('002')
  expect(str_pad(1, 2)).toEqual('01')
  expect(str_pad(1, 1)).toEqual('1')
  expect(str_pad(0, 1)).toEqual('0')
})