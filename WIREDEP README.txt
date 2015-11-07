$ npm install --save wiredep

$ bower install --save jquery


	SET UP YOUR INJECTION SITES LIKE THIS
<html>
<head>
  <!-- bower:css -->
  <!-- endbower -->
</head>
<body>
  <!-- bower:js -->
  <!-- endbower -->
</body>
</html>



	THEN
$ node
> require('wiredep')({ src: 'index.html' });


	TADA!
<html>
<head>
  <!-- bower:css -->
  <!-- endbower -->
</head>
<body>
  <!-- bower:js -->
  <script src="bower_components/jquery/dist/jquery.js"></script>
  <!-- endbower -->
</body>
</html>