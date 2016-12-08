let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

let config = {
	// MS
	server_delay: 1000,
	username: 'webdriver',
	message: 'Hello from webdriver!'
};

driver.get('http://localhost:3000/')
	.then(_ => driver.findElement(By.name('register_input')).sendKeys(config.username))
	.then(_ => driver.findElement(By.name('register_button')).click())
	.then(_ => driver.findElement(By.css('#online_list li.you')).getText()
		.then((text) => {
			if(text === config.username)
				console.log('Test passed: Register');
			else
				console.log('Test failed: Register');
		}))
	.then(_ => driver.findElement(By.name('message_input')).sendKeys(config.message))
	.then(_ => driver.findElement(By.name('message_button')).click())
	.then(_ => driver.findElement(By.css('#message_board li:last-child span.info')).getText()
	  	.then((text) => {
			if(text === config.message)
				console.log('Test passed: Message');
			else
				console.log('Test failed: Message');
  		}))
	.then(_ => driver.quit());
