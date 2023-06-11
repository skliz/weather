// favicon (иконка и текст на вкладке)
function favicon(timer, t, k) {
	function changeTitle(icon, text, textColor) {
		document.querySelector('head title').textContent = text
		document.querySelector('link[rel="icon"]').setAttribute('href', icon)
	}
	// Покидаю вкладку
	window.addEventListener('blur', (e) => {
		setTimeout(() => {
			changeTitle('./icons/r.svg', t)
		}, timer)
	})
	// Возвращаюсь на вкладку
	window.addEventListener('focus', (e) => {
		setTimeout(() => {
			changeTitle('./icons/s.svg', k)
		}, timer)
	})
}
favicon(1500, `Out`, `Input`)
// -----------------------------------------------------------------------------------------------------------------------
// Weather
class Weather {
	_card = ``
	constructor($app, $form, $formInput, $cardBox) {
		Object.assign(this, { $app, $form, $formInput, $cardBox })

		this.$form.addEventListener('submit', (e) => {
			e.preventDefault()
			this.loadData(this.$formInput.value.trim())
			this.$formInput.value = ``
			this.$form.querySelector('#form-label').textContent = ``
		})
	}

	// Получение данных с API
	async loadData(city) {
		const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=a68f1c86e0b5ee48a587c1956f921a58`;
		try {
			const response = await fetch(url, {})
				.then(res => res.json())
				.then(data => this.getNewCard(data))
		} catch (err) {
			this.$form.querySelector('#form-label').textContent = `Введите корректное название города!`
			console.log('Error >>>', err)
			throw err;
		}
	}

	// Отрисовка карточки
	getNewCard(data) {
		console.log(data);
		const location = data.name
		const temp = Math.round(data.main.temp)
		const weatherStatus = data.weather[0].main
		const weatherIcon = data.weather[0].icon
		const wind = data.wind.speed
		const humidity = data.main.humidity

		this._card = `
		<article class="card">
		<div class="card__top">
			<div class="card__top-left">
				<p class="card__icon card__icon_big">
					<img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">
				</p>
				<div class="card__title">
					<h3 class="card__city">${location}</h3>
					<p class="card__descr">${weatherStatus}</p>
				</div>
			</div>
			<div class="card__top-right">
				<i class="card__icon fa-solid fa-temperature-half"></i>
				<p class="card__temp">${temp}<sup>o</sup><span>C</span></p>
			</div>
		</div>
		<div class="card__bottom">
			<div class="card__bottom-left">
				<i class="card__icon fa-solid fa-wind"></i>
				<p class="card__wind">${wind}<span>m/s</span></p>
			</div>
			<div class="card__bottom-right">
				<i class="card__icon fa-solid fa-droplet"></i>
				<p class="card__humidity">${humidity}<span>%</span></p>
			</div>
		</div>
	</article>
		`
		this.$cardBox.innerHTML += this._card

		let timerId = setTimeout(() => {
			this.$cardBox.querySelector('.card').classList.add('loading')
		}, 500)

		if (this.$cardBox.children.length > 1) {
			clearTimeout(timerId);
		}

		setTimeout(() => {
			document.body.style.backgroundImage = `url(img/${weatherIcon}.jpg)`
			document.body.classList.add('after')
			this.$app.classList.add('top')
			this.$cardBox.querySelectorAll('.card').forEach(e => e.classList.remove('loading'))
			this.$cardBox.querySelectorAll('.card').forEach(e => e.classList.add('full'))
			if (this.$cardBox.children.length > 1) {
				this.$cardBox.querySelectorAll('.card').forEach(e => e.classList.remove('full'))
				this.$cardBox.querySelectorAll('.card').forEach(e => e.classList.add('glass'))
			}
		}, 1500)
	}
}
const weather = new Weather(
	document.getElementById('app'),
	document.getElementById('form'),
	document.getElementById('form-input'),
	document.getElementById('card-box')
)
