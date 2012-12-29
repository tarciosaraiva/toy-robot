// available commands
var commands = ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'];

var DIRECTION = {
    N:  {value:'North', img:'robot-north.png', id: 1},
    S:  {value:'South', img:'robot-south.png', id: 3},
    E:  {value:'East', img:'robot-east.png', id: 2},
    W:  {value:'West', img:'robot-west.png', id: 4},
    getDirection : function(id) {
        if (id == 1) {
            return this.N;
        } else if (id == 2) {
            return this.E;
        } else if (id == 3) {
            return this.S;
        } else if (id == 4) {
            return this.W;
        } else {
            return undefined;
        }
    }
};

robotObject = {
    positionX: -1,
    positionY: -1,
    direction: DIRECTION.N,
    isInPlace: function() {
        return (this.positionX > -1 && this.positionY > -1);
    },
    place: function(x,y,facing) {
        // clean up the table
        $('.tabletop div').html('');

        this.direction  = facing;
        this.positionX  = x;
        this.positionY  = y;

        displayRobotOnSquare(this.positionX,this.positionY,this.direction);
    },
    move: function() {
        // clean up the table
        $('.tabletop div').html('');

        // move up,down,right or left
        if (this.direction == DIRECTION.N) {
            this.positionY+=1;
            if (this.positionY > 4) {this.positionY = 4;}
        } else if (this.direction == DIRECTION.S) {
            this.positionY-=1;
            if (this.positionY < 0) {this.positionY = 0;}
        } else if (this.direction == DIRECTION.E) {
            this.positionX+=1;
            if (this.positionX > 4) {this.positionX = 4;}
        } else if (this.direction == DIRECTION.W) {
            this.positionX-=1;
            if (this.positionX < 0) {this.positionX = 0;}
        }

        displayRobotOnSquare(this.positionX,this.positionY,this.direction);
    },
    face: function(side) {
        var directionId = this.direction.id;

        if (side == 'LEFT') {
            directionId--;
            if (directionId < 1) { directionId = 4; }
        } else if (side == 'RIGHT') {
            directionId++;
            if (directionId > 4) { directionId = 1; }
        }

        this.direction = DIRECTION.getDirection(directionId);
        displayRobotOnSquare(this.positionX,this.positionY,this.direction);
    },
    report: function() {
        var reportMsg = 'I\'m at box [' + this.positionX + ',' + this.positionY + '] facing ' + this.direction.value;
        $('.report').html(reportMsg);
        $('.report').fadeIn('slow').delay(10000).fadeOut('fast');
    }
};

// whenever the DOM is ready
$(document).ready(function() {
    $('#commandForm').submit(function(event) {
        event.preventDefault();

        var formValues  = $(this).serialize();
        var fullCommand = decodeURIComponent(formValues.substr(formValues.indexOf('=') + 1));
        
        var command     = '';
        var params      = [];

        if (fullCommand.indexOf('+') > -1) {
            command     = fullCommand.substring(0, fullCommand.indexOf('+'));
            params      = fullCommand.substr(fullCommand.indexOf('+') + 1).split(',');
        } else {
            command     = fullCommand;
        }

        // verify validity of the command
        if (commands.indexOf(command) > -1) {
            if (command == commands[0]) {

                // must always have 3 parameters
                if (params.length < 3) {
                    showError('Invocation of the PLACE command: PLACE X,Y,[NORTH | SOUTH | EAST | WEST]');
                }

                // the last parameter is where the robot will be facing should be converted to an object
                var robotFacingDiretion;
                var facingParameter = params[2].toUpperCase();

                if (DIRECTION.N.value.toUpperCase() == facingParameter) {
                    robotFacingDiretion = DIRECTION.N;
                } else if (DIRECTION.S.value.toUpperCase() == facingParameter) {
                    robotFacingDiretion = DIRECTION.S;
                } else if (DIRECTION.E.value.toUpperCase() == facingParameter) {
                    robotFacingDiretion = DIRECTION.E;
                } else if (DIRECTION.W.value.toUpperCase() == facingParameter) {
                    robotFacingDiretion = DIRECTION.W;
                } else {
                    showError('Direction must be NORTH, SOUTH, EAST or WEST');
                }

                // then validate the parameters, should be within the range
                validateCoordinatesRange(params[0]);
                validateCoordinatesRange(params[1]);

                robotObject.place(new Number(params[0]),new Number(params[1]),robotFacingDiretion);
            } else if (command == commands[1]) {
                if (robotObject.isInPlace()) {
                    robotObject.move();
                } else {
                    showError('You must place the robot first. Hint: use the PLACE command.');
                }
            } else if (command == commands[2] || command == commands[3]) {
                if (robotObject.isInPlace()) {
                    robotObject.face(command);
                } else {
                    showError('You must place the robot first. Hint: use the PLACE command.');
                }
            } else if (command == commands[4]) {
                if (robotObject.isInPlace()) {
                    robotObject.report();
                } else {
                    showError('You must place the robot first. Hint: use the PLACE command.');
                }
            }
        } else {
            showError('Valid commands are: PLACE, MOVE, LEFT, RIGHT, REPORT');
        }
    });
});

function showError(message) {
    $('.error').html(message);
    $('.error').fadeIn('slow').delay(6000).fadeOut('fast');
    return false;
}

function validateCoordinatesRange(coordinate) {
    if (coordinate < 0 || coordinate > 4) {
        showError('Position should be within 0 and 4.');
    }
}

function displayRobotOnSquare(x,y,direction) {
    var coordinate = x + ',' + y;
    var box = $('.tabletop div[data-position|="' + coordinate + '"]');
    box.html('<img src="img/' + direction.img + '">');
}