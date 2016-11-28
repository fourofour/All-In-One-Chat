class Log {
	constructor(target = document) {
		this.target = target
	}

	message(message = '') {				
	  	let element = document.createElement('li'),
      		text = document.createTextNode(message);

  		element.appendChild(text);
	  	this.target.appendChild(element);
	}
}

export default Log;