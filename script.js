
var points = [];
var espessura//por enquanto a expressura é definida no script
var pointsUp = [];//pontos de Cima
var pointsDown = [];//pontos de Baixo
var vetores = [];
var contadorPontos = 0;
var av = 1000;
//---------------------Vetor---------------------------------------

	function normalizar(v1){
		var vt = {x: v1.x/v1.norma, y: v1.y/v1.norma, norma: 1};
		return vt;
	}

	function subtraiVetor(v1, v2){//v1 - v2
		var newX = v1.x - v2.x;
		var newY = v1.y - v2.y;
		var vt = {x: newX, y: newY, norma: Math.sqrt(newX*newX + newY*newY)};
		return vt;
	}

	function produtoInterno (v1, v2){
		return ((v1.x * v2.x) + (v1.y + v2.y));
	}

	function anguloVetor(v1, v2){//retorna o cosseno do angulo
		return ( (produtoInterno(v1, v2)) / (v1.norma * v2.norma) );
	}
	function ortogonal(v1){//consegue um vetor ortogonal, serah utilizado caso os 3 pontos sejam colineares
		var vt = {x: vq.y, y: -v1.x, norma: Math.sqrt(v1.y*v1.y + v1.x*vq.x)};
		return vt;
	}

//----------------------------Calculo dos pontos a mais ------------------------------------

	var vtPontos;

function novosPontos(){
	espessura = 50;//por enquanto a expressura é definida no script

	vetores = [];

	for(var cont1 = 0; cont1 < (contadorPontos - 1) ; cont1++){

		var xt = (points[cont1 + 1].x - points[cont1].x);
		var yt = (points[cont1 + 1].y - points[cont1].y);
		var vet = {x: xt, y: yt, norma: Math.sqrt(xt*xt + yt*yt)};
		vetores.push(vet);
		vetores[cont1] = normalizar(vetores[cont1]);//vetor já normalizado

	}//todos os vetores obtidos

	pointsUp = [];
	pointsDown = [];
	//zerando os dois pontos
	
	for (var i = 0; i < points.length; i++) {
		var coordPointsTemp = { x: points[i].x, y: points[i].y};
		var coordPointsTemp1 = { x: points[i].x, y: points[i].y};
		pointsUp.push(coordPointsTemp);
		pointsDown.push(coordPointsTemp1);
	}



	for(var cont = 0; cont < (vetores.length - 1) ; cont++) {

		if(anguloVetor(vetores[cont + 1], vetores[cont]) != -1){//caso os 3 pontos nao sejam colineares
			vtPontos = subtraiVetor(vetores[cont + 1], vetores[cont]);
		}else{
			vtPontos = ortogonal(vetores[cont]);//pode haver confusao, corrigir
		}

		vtPontos = normalizar(vtPontos);


		pointsDown[cont + 1].x = (vtPontos.x * (-espessura)) + points[cont+1].x;
		pointsDown[cont + 1].y = (vtPontos.y * (-espessura)) + points[cont+1].y;

		pointsUp[cont + 1].x = (vtPontos.x * espessura) + points[cont+1].x;
		pointsUp[cont + 1].y = (vtPontos.y * espessura) + points[cont+1].y;



	}
}


//----------------------Cavnas-------------------------------------

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


resizeCanvas();

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}


canvas.addEventListener('mousedown', e => {
  var click = {x: e.offsetX, y: e.offsetY, v:{x: 0, y:0}};
  index = getIndex(click);
  if (index === -1) {
    contadorPontos = contadorPontos + 1;
    points.push(click);
    drawPoints();
  } else {
    move = true;
  }


  

});

function dist(p1, p2) {
  var v = {x: p1.x - p2.x, y: p1.y - p2.y};
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getIndex(click) {
  for (var i in points) {
    if (dist(points[i], click) <= 10) {
      return i;
    }
  }
  return -1;
}

function drawPoints() {
  //desenha todos os pontos
  for (var i in points) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    //ligando os pontos
    if(i > 0){
      var xAtual = points[i-1].x;
      var yAtual = points[i-1].y;
      ctx.moveTo(xAtual, yAtual);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
  }

  if(contadorPontos > 2) {
	  novosPontos();
  
	  for (var i in pointsUp) {
	    ctx.beginPath();
	    ctx.arc(pointsUp[i].x, pointsUp[i].y, 5, 0, 2 * Math.PI);
	    ctx.fillStyle = 'yellow';
	    ctx.fill();

	    //ligando os pontos
	   
	  }

	  for (var i in pointsDown) {
	    ctx.beginPath();
	    ctx.arc(pointsDown[i].x, pointsDown[i].y, 5, 0, 2 * Math.PI);
	    ctx.fillStyle = 'black';
	    ctx.fill();

	    //ligando os pontos
	   
	  }
	  calcAvaliable();

	}
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);//redesenha o canvas
  drawPoints();
}, 100);



function drawCurve(pointsCurve) {
  if(contadorPontos > 2) {
    for(var i in pointsCurve) {
      ctx.beginPath();
      
      if(i > 0) {
        var xAtual = pointsCurve[i-1].x;
        var yAtual = pointsCurve[i-1].y;
        ctx.moveTo(xAtual, yAtual);
        ctx.lineTo(pointsCurve[i].x, pointsCurve[i].y);
        ctx.stroke();
      }
    }
  }
}

function casteljauX(array, t, r, i){
    if(r == 0){
        return array[i].x;
    }
    else{
        return ((1 - t) * casteljauX(array, t, (r-1), i)) + (t * casteljauX(array, t, (r - 1), i+ 1));
    }
}

function casteljauY(array, t, r, i){
    if(r == 0){
        return array[i].y;
    }
    else{
        return ((1 - t) * casteljauY(array, t, (r-1), i)) + (t * casteljauY(array, t, (r - 1), i+ 1));
    }
}

function calcAvaliable() {
  var pointsCurve = [];
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < av; t = t + 1/av, cont++){
  	var X = casteljauX(points, t, (contadorPontos - 1), 0);
  	var Y = casteljauY(points, t, (contadorPontos - 1), 0);
  	var pontoCurva = {x: X, y: Y};
  	pointsCurve.push(pontoCurva);
  }
  drawCurve(pointsCurve);


  var pointsCurveUp = [];
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < av; t = t + 1/av, cont++){
  	var X = casteljauX(pointsUp, t, (contadorPontos - 1), 0);
  	var Y = casteljauY(pointsUp, t, (contadorPontos - 1), 0);
  	var pontoCurva = {x: X, y: Y};
  	pointsCurveUp.push(pontoCurva);
  }
  drawCurve(pointsCurveUp);

  var pointsCurveDown = [];
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < av; t = t + 1/av, cont++){
  	var X = casteljauX(pointsDown, t, (contadorPontos - 1), 0);
  	var Y = casteljauY(pointsDown, t, (contadorPontos - 1), 0);
  	var pontoCurva = {x: X, y: Y};
  	pointsCurveDown.push(pontoCurva);
  }
  drawCurve(pointsCurveDown);

}





canvas.addEventListener('mousemove', e => {
  if(move){
    var antigo = points[index];
    points[index] = {x: e.offsetX, y: e.offsetY, v:{x:0 , y:0}};
    points[index].v = {x: e.offsetX - antigo.x, y: e.offsetY - antigo.y}
    drawPoints();
  }     
});

canvas.addEventListener('mouseup', e => {
  move = false;
});
