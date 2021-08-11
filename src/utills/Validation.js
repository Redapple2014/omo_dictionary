module.exports = {

  varifyEmail: function (input) {
    //console.log(`Email id input : ${input}`);
    let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (reg.test(input) === false) {
      //console.log("Email pattern is not correct");
      return false;
    }
    else {
      //console.log("Email pattern is correct");
      return true
    }
  },
  varifyPhone: function (input) {
    //console.log(`Phone number input : ${input}`);
    if(input.length==10){
      return true
    }else{
      return false
    }
  }
  ,
  varifyPassword: function (input) {
    //console.log(`Password input : ${input}`);
    let reg = /^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (reg.test(input) === false) {
      //console.log("Password pattern is Not Correct");
      return false;
    }
    else {
      //console.log("Password pattern is Correct");
      return true
    }
  }

};