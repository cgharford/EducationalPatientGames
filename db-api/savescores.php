<?php

$db = "highscoretable";                         // Database name
$dbu = "b07de4b28c4e0d";                        // Database username
$dbp = "23394b2e";                              // Database users' password
$host = "us-cdbr-azure-east-a.cloudapp.net";    // MySQL server - usually localhost

$dblink = mysql_connect($host,$dbu,$dbp);
$seldb = mysql_select_db($db);

if(isset($_POST['game']) && isset($_POST['score'])){

     // Lightly sanitize the GET's to prevent SQL injections and possible XSS attacks
     $game = $_POST['game'];
     $score = strip_tags(mysql_real_escape_string($_POST['score']));
     if ($game == "water") {
          $sql = mysql_query("INSERT INTO `$db`.`water-scores` (`id`,`score`) VALUES ('0','$score');");
     } else if ($game == "helmet") {
          $sql = mysql_query("INSERT INTO `$db`.`helmet-scores` (`id`,`score`) VALUES ('0','$score');");
     } else if ($game == "fire") {
          $sql = mysql_query("INSERT INTO `$db`.`fire-scores` (`id`,`score`) VALUES ('0','$score');");
     }

     if($sql){

          // Retrieve data from database
          if($game == "water") {
               $sql="SELECT * FROM `water-scores` ORDER BY score DESC LIMIT 5";
          } else if ($game == "helmet") {
               $sql = "SELECT * FROM `helmet-scores` ORDER BY score DESC LIMIT 5";
          } else if ($game == "fire") {
               $sql = "SELECT * FROM `fire-scores` ORDER BY score ASC LIMIT 5";
          }
          $result=mysql_query($sql);

          // Start looping rows in mysql database.
          while($rows=mysql_fetch_array($result)) {
               echo $rows['score'] . "|";
          }

     // The query returned false - you might want to put some sort of error reporting here. Even logging the error to a text file is fine.
     } else {
          echo 'There was a problem saving your score. Please try again later.';
     }

} else{
     echo 'Your name or score wasnt passed in the request. Make sure you add name=NAME_HERE&score=1337 to the tags.';
}

// Close off the MySQL connection to save resources.
mysql_close($dblink);

?>
