// A Dynamic Programming based
// Javascript program for edit
// distance problem
// This code is contributed
// by Shivi_Aggarwal
function edit_distance(str1, str2) {
  // Fill d[][] in bottom up manner
  var dp = new Array(str1.length + 1);
  for (var i = 0; i <= str1.length; i++)
    dp[i] = new Array(str2.length + 1);

  for (var i = 0; i <= str1.length; i++)
    for (var j = 0; j <= str2.length; j++)
    {
      // If first string is empty,
      // only option is to insert
      // all characters of second string
      if (i == 0)
        dp[i][j] = j ; // Min. operations = j

      // If second string is empty,
      // only option is to remove
      // all characters of second string
      else if(j == 0)
        dp[i][j] = i; // Min. operations = i

      // If last characters are same,
      // ignore last char and recur
      // for remaining string
      else if(str1[i - 1] == str2[j - 1])
        dp[i][j] = dp[i - 1][j - 1];

      // If last character are different,
      // consider all possibilities and
      // find minimum
      else
        dp[i][j] = 1 + Math.min(dp[i][j - 1],   // Insert
                                dp[i - 1][j],   // Remove
                                dp[i - 1][j - 1]); // Replace
    }
  return dp[str1.length][str2.length] ;
}

fetch("./common_passwords.txt").then(response => response.text()).then((text) => {
  var comm_pass = text.replace(/\n$/, "").split("\n");

  setInterval(() => {
    var str = document.getElementById("password").value;
    if (str.length > 0) {
      if (str.length < 6)
        document.getElementById("passStr").innerHTML = "<b>Weak</b>";
      else {
        var dist = 999;
        for (const pass of comm_pass)
          dist = Math.min(dist, edit_distance(str, pass) / (1.0 * str.length));

        if (dist < 0.2)
          document.getElementById("passStr").innerHTML = "<b>Weak</b>";
        else if ((dist > 0.5) && (/[A-Z]/.test(str)) && (/[a-z]/.test(str)) && (/[0-9]/.test(str)))
          document.getElementById("passStr").innerHTML = "<i>Strong</i>";
        else
          document.getElementById("passStr").innerHTML = "Medium";
      }
    }
    else
      document.getElementById("passStr").innerHTML = "None";
  }, 200);
});