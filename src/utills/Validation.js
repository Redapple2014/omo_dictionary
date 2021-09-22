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
    if (input.length == 10) {
      return true
    } else {
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










                    //     let reference = storage().ref('/users');
                    //     let task = reference.putFile(profilePicDetails.uri);
                    //     task.then((res) => {
                    //         console.log(res)
                    //         console.log('Image uploaded to the bucket!');
                    //         // this.setState({ isLoading: false, status: 'Image uploaded successfully' });
                    //     }).catch((e) => {
                    //         // status = 'Something went wrong';
                    //         console.log('uploading image error => ', e);
                    //         // this.setState({ isLoading: false, status: 'Something went wrong' });
                    //     });
                    // const userData = {
                    //     uid:res.user.uid,
                    //     displayName:name,
                    //     username,
                    //     email,
                    //     PhotoURL:profilePicDetails.uri,
                    //     password:base64.encode(password)
                    // }
                    // console.log('User data :',userData)