<?php

$db = "highscoretables";                        // Database name
$dbu = "b718479f473e6e";                        // Database username
$dbp = "1001f7fc";                              // Database users' password
$host = "us-cdbr-azure-east-a.cloudapp.net";    // MySQL server - usually localhost

$dblink = mysql_connect($host, $dbu, $dbp);
$seldb = mysql_select_db($db);

if(isset($_POST['game']) && isset($_POST['score'])) {

	// Lightly sanitize the GET's to prevent SQL injections and possible XSS attacks
	$game = $_POST['game'];
	$score = strip_tags(mysql_real_escape_string($_POST['score']));

	// Simply insert id, name, and score into the table
	if ($game == "water") {
		$sql = mysql_query("INSERT INTO `$db`.`water-scores` (`id`, `score`) VALUES ('0', '$score');");
	} else if ($game == "helmet") {
		$sql = mysql_query("INSERT INTO `$db`.`helmet-scores` (`id`, `score`) VALUES ('0', '$score');");
		
	// Here highscores are specific to the puzzle and difficulty level selected
	} else if ($game == "burn") {
		
		// Obtain difficulty id
		$difficulty = strip_tags(mysql_real_escape_string($_POST['difficulty']));
		$drow = mysql_fetch_array(mysql_query("SELECT id FROM difficulty WHERE level = '$difficulty'"));
		
		// Obtain puzzle id
		$puzzle = strip_tags(mysql_real_escape_string($_POST['puzzle']));
		$prow = mysql_fetch_array(mysql_query("SELECT id FROM puzzle WHERE name = '$puzzle'"));
		
		// Insert into our table
		$sql = mysql_query("INSERT INTO burn_scores (score, difficulty_id, puzzle_id) VALUES ($score, {$drow['id']}, {$prow['id']})");
	}

	// Retrieve data from database
	if($sql){

		if($game == "water") {
			$sql="SELECT * FROM `water-scores` ORDER BY score DESC LIMIT 5";
		} else if ($game == "helmet") {
			$sql = "SELECT * FROM `helmet-scores` ORDER BY score DESC LIMIT 5";
		} else if ($game == "burn") {
			$sql = "SELECT * FROM burn_scores WHERE difficulty_id = {$drow['id']} AND puzzle_id = {$prow['id']} ORDER BY score ASC LIMIT 5";
		}
		
		$result = mysql_query($sql);
		while($rows = mysql_fetch_array($result)) {
			echo $rows['score'] . "|";
		}
		
	} else {
		echo 'There was a problem saving your score. Please try again later.';
	}

} else{
	echo "Your name or score wasn't passed in the request. Make sure you add name=NAME_HERE&score=1337 to the tags.";
}

// Close off the MySQL connection to save resources.
mysql_close($dblink);

?>
