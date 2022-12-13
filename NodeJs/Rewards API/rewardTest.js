const {
    calculateReward,
    calculateROI
  } = require("./reward");

//   calculateReward("ZCL", 93, 290, 0.1, 0.1).then(response => {
//       console.log("Reward: ", response);
//   }).catch(error => console.log(error));
console.log("ROI: ", calculateROI(1500, 950));