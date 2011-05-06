/**
 * Executed in the page. Hooks into StreetViewPanorama constructor.
 */
var toExecute = function() {
  var SVP = google.maps.StreetViewPanorama;
  google.maps.StreetViewPanorama = function(container, opts) {
    var wrapped = new SVP(container, opts);
    wrapped.setOptions({
      'mode': 'webgl' // undocumented property.
    });
    return wrapped;
  };

  var mapProto = google.maps.Map.prototype;
  var oldMethod = mapProto.getStreetView;
  mapProto.getStreetView = function() {
    var pano = oldMethod.apply(this, arguments);
    pano.setOptions({
      'mode': 'webgl' // undocumented property
    });
    return pano;
  };
};

function createScript() {
  var script = document.createElement('script');
  script.innerHTML = '(' + toExecute + ')()';
  return script;
}

window.addEventListener('DOMContentLoaded', function() {
  var scripts = document.getElementsByTagName('script');
  for (var i = 0, script; script = scripts[i]; i++) {
    if (/maps.google.com/.test(script.src)) {
      console.log('Forcing WebGL StreetView');
      script.nextSibling && script.parentNode.insertBefore(createScript(), script.nextSibling);
      break;
    }
  }
});
