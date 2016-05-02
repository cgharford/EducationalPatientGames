/**
 * Write Table
 * ==================================
 *
 * Creates the HTML for our highscore table and displays the top four high scores.
*/
function writeTable(score, board) {
    loadTable(score, board, function(responseArray) {
        var tbody = $('#body');
        for (var i = 0; i < 4; i++) {
            if(responseArray[i] > 0){
                var tr = $('<tr>').appendTo(tbody);
                tr.append('<td class="scorelabel">' + 'High Score '+ (i + 1) + ' ' + '</td>');
                tr.append('<td class="scoreval">' + window.formatScore(responseArray[i]) + '</td>');
            }
        }
        var tr = $('<tr>').appendTo(tbody);
        tr.append('<td class="scorelabel-personal">' + 'Your Score' + '</td>');
        tr.append('<td class="scoreval">' + window.formatScore(score) + '</td>');
    });
}

/**
 * Load Table
 * ==================================
 *
 * Fetches the high scores from the database, database info in the db-api folder
*/
function loadTable(score, board, callback) {

    // Get the cookie for high scores.
    // Split the XHR response if it was successfully received
    var responseArray = [10, 10, 10, 10];
    var errorArray = [score, -1, -1, -1];

    /* Send a POST request to the high score database
     * Returns a pipe-delimeted string of the top 5 scores (in order)
     * (ex: 2000|1000|750|565|20)
     */
    $.ajax({
        type: 'POST',
        url: '/db-api/savescores.php',
        data: 'game=burn&score=' + score + '&difficulty=' + board.difficulty + '&puzzle=' + board.puzzleName,
        dataType: "text",
        async: false,
        success: function(data, status) {
            try {
                responseArray = data.split("|");
            } catch (e) { // Otherwise, follow built-in error handling procedure
                responseArray = errorArray;
            }
			
            for(var i = 0; i < responseArray.length; i++) {
                if(responseArray[i] === undefined || responseArray === "NULL") {
                    responseArray[i] = errorArray[i];
                }
            }
        },
        complete: function(jqXHR, textStatus) {
            callback(responseArray);
        }
    });

}
