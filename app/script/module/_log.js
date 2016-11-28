class Log {
	function constructor(target = document) {
		this.target = target
	}

	function message(message = '') {				
	  	let element = document.createElement('li'),
      		text = document.createTextNode(message);

  		element.appendChild(text);
	  	this.target.appendChild(element);
	}
}

export log;