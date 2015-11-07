function ParseURL () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString
  var query_string = [];
  var query = window.location.href;
  var pre = query.split(/index\.html#?\/?/);
  URL=pre[0]+'/index.html#';
    if(pre[1]) var vars = pre[1].split("/");
    else var vars='';
  for (var i=0;i<vars.length;i++) {
      var temp = decodeURIComponent(vars[i]);
      if (temp) query_string[i] = temp;   //doesn't terminate at empty entries, ie: / / 
    }
    return query_string;
}

module.exports= ParseURL;
