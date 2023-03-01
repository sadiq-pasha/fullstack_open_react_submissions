const validationTester = (name, inputNumber) => {
  inputNumber = inputNumber.trim().split('-')
  // name must be between 3 and 50 characters long
  if (name.length < 3 || name.length > 50) return false
  // number cannot have more than one '-'
  if (inputNumber.length > 2) return false
  // number must be of length 8 or more
  if (inputNumber.reduce((acc, value) => acc + value.length , 0) < 8) return false
  // if number has two parts, the first part must be between 2 and 3 digits long
  if ((inputNumber.length > 1) && (inputNumber[0].length < 2 || inputNumber[0].length > 3)) return false
  // only numbers allowed in the string
  if (inputNumber.every((part) => {
    return /^\d+$/.test(part)
  }))
    return true
}

// test_cases = [["Arto Hellas","040-123456"], ["Ada Lovelace","39-445323"], ["Dan Abramov","12-434345"], ["Mary Poppendieck","39-233122"]]

// test_cases.forEach((inputCase,index) => {
//     console.log(inputCase[0], inputCase[1])
//     if (validationTester(inputCase[0], inputCase[1])) {
//         console.log(`${index} is valid`)
//     } else {
//         console.log(`${index} is NOT valid`)
//     }
// })
export default validationTester