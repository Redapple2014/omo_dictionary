let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function goBack() {
  navigator._navigation.goBack();
}

// add other navigation functions that you need and export them

export default {
  goBack,
  setTopLevelNavigator
};
