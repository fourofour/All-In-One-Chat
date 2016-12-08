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
	target: {
		name: '',
		promise: null
	},
	message: {
		poke: 'You poked '
	}
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
	.then(_ => { config.target.promise = driver.findElement(By.css('#online_list li:not(.you)')) })
	.then(_ => { config.target.promise.findElement(By.css('.info')).getText()
		.then((text) => {
			config.target.name = text;
		})})
	.then(_ => config.target.promise.findElement(By.css('.poke')).click())
	.then(_ => driver.findElement(By.css('#message_board li:last-child span.info')).getText()
	  	.then((text) => {
			if(text === (config.message.poke + config.target.name))
				console.log('Test passed: Poke');
			else
				console.log('Test failed: Poke');
  		}))
	.then(_ => driver.quit());
