if (! document.querySelector('[ng-app]')) {
  console.warn("angular-viz: ng-app attribute not found! manually bootstrapped pages not currently supported :-(");
}

var appName =  angular.element(document).injector().get('$rootElement').attr('ng-app');

var inj;
function allServices(mod, r) {
  if (!r) {
    r = {};
    inj = angular.element(document.querySelector('[ng-app]')).injector().get;
  }
  angular.forEach(angular.module(mod).requires, function(m) {allServices(m,r)});
  angular.forEach(angular.module(mod)._invokeQueue, function(a) {
    try { r[a[2][0]] = inj(a[2][0]); } catch (e) {}
  });
  return r;
}

allMyServices = allServices(appName);

for(var k in allMyServices) {
  var o = allMyServices[k];
  for (var kk in o) {
    var v = o[kk];
    if (typeof v === 'function') {
      vizone.patch(o, kk);
    }
  }
}

var ngels = document.querySelectorAll('.ng-scope')

for (var i in ngels) {
  var el = angular.element(ngels[i]);
  var scope = el.scope();
  for (var j in scope) {
    var v = scope[j];
    if (scope.hasOwnProperty(j) && (typeof v === 'function')) {
      console.log(j)
      vizone.patch(scope, j, {title:'scope '+scope.$id+'.'+j});
    }
  }
}