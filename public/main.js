document.addEventListener('DOMContentLoaded', function() {
  // var svgEl = document.getElementById('bars')
  var s = Snap('#bars');
  // console.log(s);

  Snap.load("/images/tvbars_vector.svg", function (f) {
    // Making croc draggable. Go ahead drag it around!
    var doc = f.select('#TVBars');
    console.log(doc);
    s.append(doc);
    // document.querySelector('#main-header').appendChild(doc)
    // Obviously drag could take event handlers too
    // Looks like our croc is made from more than one polygon...
  });

}, false);
