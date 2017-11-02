
var points = [];
var espessura//por enquanto a expressura é definida no script
var pointsUp = [];//pontos de Cima
var pointsDown = [];//pontos de Baixo
var vetores = [];
var contadorPontos = 0;
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

function novosPontos(){
	espessura = 15;//por enquanto a expressura é definida no script

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
		pointsUp.push(points[i]);
		pointsDown.push(points[i]);
	}
	//slice para igualar os extremos e ter a quantidade de pontos intermediários iguais (precisando apenas de alterar)

	var vt;


	for(var cont = 0; cont < (vetores.length - 1) ; cont++) {

		if(anguloVetor(vetores[cont + 1], vetores[cont]) != -1){//caso os 3 pontos nao sejam colineares
			vt = subtraiVetor(vetores[cont + 1], vetores[cont]);
		}else{
			vt = ortogonal(vetores[cont]);//pode haver confusao, corrigir
		}

		vt = normalizar(vt);

		pointsUp[cont + 1].x = (vt.x * espessura) + points[cont+1].x;
		pointsUp[cont + 1].y = (vt.y * espessura) + points[cont+1].y;

		pointsDown[cont + 1].x = (vt.x * (-espessura)) + points[cont+1].x;
		pointsDown[cont + 1].x = (vt.y * (-espessura)) + points[cont+1].y;


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


  if(contadorPontos > 2) {
    novosPontos();
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
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);//redesenha o canvas
  drawPoints();
}, 100);