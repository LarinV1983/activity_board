async function getBoardData(url ='/data.json') {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

class BoardItem {
	 static PERIODS = {
        daily: 'day',
        weekly: 'week',
        monthly: 'month',
    }
	constructor (data, container = '.board__content', view = 'weekly') {
		this.data = data;
		this.container = document.querySelector('container');
		this.view = view;

		this._createMarkup();
	}
	_createMarkup() {
		 const {title, timeframes} = this.data;
        const id = title.toLowerCase().replace(/ /g, '-');
        const {current, previous} = timeframes[this.view.toLowerCase()];

        this.container.insertAdjacentHTML('beforeend', `
            <div class="board__item board__item--${id}">
				<div class="tracking-card">
					<div class="tracking-card__header">
						<h4 class="tracking-card__title">${title}</h4>
						<img src="images/icon-ellipsis.svg" alt="menu" 
						class="tracking-card__menu">
					</div>
					<div class="tracking-card__body">
						<div class="tracking-card__time">
							${current}hrs
						</div>
						<div class="tracking-card__period">
					Last ${BoardItem.PERIODS[this.view]} - ${previous}hrs					
					</div>
				 </div>
				</div>
			</div>
        `);

        this.time = this.container.querySelector(`.board__item--${id} .tracking-card__time`);
        this.prev = this.container.querySelector(`.board__item--${id} .tracking-card__period`);
	}

	 changeView(view) {
        this.view = view.toLowerCase();
        const {current, previous} = this.data.timeframes[this.view.toLowerCase()];

        this.time.innerText = `${current}hrs`;
        this.prev.innerText = `Last ${BoardItem.PERIODS[this.view]} - ${previous}hrs`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
	getBoardData()
	.then(data =>{
		 const activities = data.map(activity => new BoardItem(activity));
		 selectors.forEach(selector => 
        selector.addEventListener('click', function() {
        selectors.forEach(sel => sel.classList.remove('view-selector__item--active'))
        selector.classList.add('view-selector__item--active');
        const currentView = selector.innerText.trim().toLowerCase();
        activities.forEach(activity => activity.changeView(currentView));
				})
			)
		})
});