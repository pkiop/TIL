const regToBinary = (reg) => {
  if(reg === "R1") {
    return "001";
  }
  if(reg === "R2") {
    return "010";
  }
  if(reg === "R3") {
    return "011";
  }
  if(reg === "R4") {
    return "100";
  }
  if(reg === "R5") {
    return "101";
  }
  if(reg === "R6") {
    return "110";
  }
  if(reg === "R7") {
    return "111";
  }
}

const instToBinary = {
  LOAD1  : "0001",
  LOAD2  : "0010",
  STORE1 : "0011",
  STORE2 : "0100",
  AND    : "0101",
  OR     : "0110",
  ADD1   : "0111",
  ADD2   : "1000",
  SUB1   : "1001",
  SUB2   : "1010",
  MOV    : "1011",
}

const numToBinary = (num) => {
  if(num == 0) {
    return "";
  }
  return numToBinary(parseInt(num / 2)) + num % 2;
}

const stringNumToBinary = (stringNum, length = 5) => {
  if(stringNum[0] == '#') {
    stringNum = stringNum.slice(1);
  }
  let num = 0;
  if(stringNum[0] == '0' && stringNum[1] == 'x'){
    num = parseInt(stringNum, 16);
  }
  else {
    num = parseInt(stringNum);
  }
  if(num === NaN) {
    throw "이상한 숫자가 들어왔습니다.";
  }
  let ret = numToBinary(num);
  let plus0 = length - ret.length;
  let zeros = "";
  for(let i=0;i<plus0;++i) {
    zeros += "0";
  }
  ret = zeros + ret;
  return ret;
}

const interprete = (program) => {
  let newTemp = [];
  let result = [];
  program = program.replace(/,/g, "").split("\n"); // g는 전역
  program.forEach((a) => newTemp.push(a.split(' ')));
  let WORD = "";
  for(const a of newTemp) {
    switch(a[0]) {
      case 'LOAD':
        if(a[3][0] == "R") { // register
          WORD = instToBinary.LOAD1 + regToBinary(a[1]) + regToBinary(a[2]) + "000"+ regToBinary(a[3]);          // 4 + 3 + 3 + 3 + 3
        } else {             // 
          WORD = instToBinary.LOAD2 + regToBinary(a[1]) + regToBinary(a[2]) + "1" + stringNumToBinary(a[3]); // 4 + 3 + 3 + 1 + 5
        }
        break;
      case 'STORE':
        if(a[3][0] == "R") { // register
          WORD = instToBinary.STORE1 + regToBinary(a[1]) + regToBinary(a[2]) + "000" + regToBinary(a[3]);          // 4 + 3 + 3 + 3 + 3
        } else {             // 
          WORD = instToBinary.STORE2 + regToBinary(a[1]) + regToBinary(a[2]) + "1" + stringNumToBinary(a[3]); // 4 + 3 + 3 + 1 + 5
        }
        break;
      case 'AND':
        WORD = instToBinary.AND + regToBinary(a[1]) + regToBinary(a[2]) + "000" + regToBinary(a[3])
        break;
      case 'OR':
        WORD = instToBinary.OR + regToBinary(a[1]) + regToBinary(a[2]) + "000" + regToBinary(a[3])
        break;
      case 'ADD':
        if(a[3][0] == "R") { // register
          WORD = instToBinary.ADD1 + regToBinary(a[1]) + regToBinary(a[2]) + "000"+ regToBinary(a[3]);          // 4 + 3 + 3 + 3 + 3
        } else {             // 
          WORD = instToBinary.ADD2 + regToBinary(a[1]) + regToBinary(a[2]) + "1" + stringNumToBinary(a[3]); // 4 + 3 + 3 + 1 + 5
        }
        break;
      case 'SUB':
        if(a[3][0] == "R") { // register
          WORD = instToBinary.SUB1 + regToBinary(a[1]) + regToBinary(a[2]) + "000"+ regToBinary(a[3]);          // 4 + 3 + 3 + 3 + 3
        } else {             // 
          WORD = instToBinary.SUB2 + regToBinary(a[1]) + regToBinary(a[2]) + "1" + stringNumToBinary(a[3]); // 4 + 3 + 3 + 1 + 5
        }
        break;
      case 'MOV':
        WORD = instToBinary.MOV + regToBinary(a[1]) + stringNumToBinary(a[2], 9); // 4 + 3 + 3 + 1 + 5
        break;
    }
    result.push(WORD);
  }
  return result;
}
