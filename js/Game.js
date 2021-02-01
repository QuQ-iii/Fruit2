class Game{
    constructor(){

    }
    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }
    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }
        player1 = createSprite(200,500);
        player1.addImage("player1",player_img);
        
        player2 = createSprite(800,500);
        player2.addImage("player2", player_img);
        players=[player1,player2];
    }
    
    play(){
        
        form.hide();

        Player.getPlayerInfo();
        image(back_img, 0, 0, 1000, 800);
        var x =100;
        var y=200;
        var index =0;
        var distance = 0;
        drawSprites();

        for(var plr in allPlayers){
        
            index = index+1;
            distance += 50;
            x = 500-allPlayers[plr].distance;
            y=500;
            
            players[index -1].x = x;
            players[index - 1].y = y;

            if(player.index !== null){
                if(index === player.index){   
                    fill("black");
                    textSize(25);
                    text(allPlayers[plr].name ,x-25,y+25); 
                }
            }

        }

        
        var player1Score = 0;
        var player2Score = 0;

        var player1ScoreRef = database.ref('players/player1/score');
        player1ScoreRef.on("value", (data) => {
            player1Score = data.val();
        })
        var player2ScoreRef = database.ref('players/player2/score');
        player2ScoreRef.on("value", (data) => {
            player2Score = data.val();
        })

        fill("white");
        textSize(40);
        text("Player 1 : " + player1Score,20, 50);
        text("Player 2 : " + player2Score,20, 100);

        
        if(player.index !== null){
            for(var i = 0; i < fruitGroup.length; i++){
                if(fruitGroup.get(i).isTouching(players)){
                    fruitGroup.get(i).destroy();
                    player.score = player.score + 1;
                    player.update();
                }
            }
            
        }

        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance -= 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null) {
            player.distance += 10
            player.update();
        }
    
        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            var rand = Math.round(random(1,5));
            switch(rand){
                case 1: fruits.addImage("fruit1",fruit1_img);
                break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                break;
            }
            fruitGroup.add(fruits);
            
        }

        if(player.score >= 10){
            this.end();
        }
    }

    end(){
        game.update(2);
        clear();
        fill("blue");
        textSize(100);
        text("GAME OVER", 200,200);

    }
}